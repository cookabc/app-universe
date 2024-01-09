import * as tf from "@tensorflow/tfjs";

let currentModel: tf.Sequential;

const flipX = (arr: number[]) => {
    return [arr.slice(6), arr.slice(3, 6), arr.slice(0, 3)].flat();
};

const flipY = (arr: number[]) => flipX(arr.slice().reverse());

// Creates a 1 hot of the diff
const showMove = (first: number[], second: number[]) => {
    let result: number[] = [];
    first.forEach((move, i) => {
        result.push(Math.abs(move - second[i]));
    });
    return result;
};

export const getMoves = (block: number[][]) => {
    let x: number[][] = [];
    let y: number[][] = [];
    // Make all the moves
    for (let i = 0; i < block.length - 1; i++) {
        const theMove = showMove(block[i], block[i + 1]);
        // Normal move
        x.push(block[i]);
        y.push(theMove);
        // Flipped X move
        x.push(flipX(block[i]));
        y.push(flipX(theMove));
        // Inverted Move
        x.push(block[i].slice().reverse());
        y.push(theMove.slice().reverse());
        // Flipped Y move
        x.push(flipY(block[i]));
        y.push(flipY(theMove));
    }
    return {x, y};
};

export const constructModel = () => {
    currentModel && currentModel.dispose();
    tf.disposeVariables();

    const model = tf.sequential();
    model.add(
        tf.layers.dense({
            inputShape: [9],
            units: 64,
            activation: "relu",
        })
    );
    model.add(
        tf.layers.dense({
            units: 64,
            activation: "relu",
        })
    );
    model.add(
        tf.layers.dense({
            units: 9,
            activation: "softmax",
        })
    );

    const learningRate = 0.005;
    model.compile({
        optimizer: tf.train.adam(learningRate),
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
    });

    currentModel = model;
    return model;
};

export const getModel = () => {
    if (currentModel) {
        return currentModel;
    } else {
        return constructModel();
    }
};

export const trainOnGames = async (
    games: {
        x: number[][];
        y: number[][]
    }[],
    setState: (model: tf.Sequential) => void
) => {
    let AllX: number[][] = [];
    let AllY: number[][] = [];
    games.forEach((game) => {
        AllX = AllX.concat(game.x);
        AllY = AllY.concat(game.y);
    });

    // Tensorfy!
    const stackedX = tf.stack(AllX);
    const stackedY = tf.stack(AllY);
    const model = constructModel();
    await trainModel(model, stackedX, stackedY);

    // clean up!
    stackedX.dispose();
    stackedY.dispose();

    setState(model);
};

const trainModel = async (model: tf.LayersModel, stackedX: tf.Tensor, stackedY: tf.Tensor) => {
    await model.fit(stackedX, stackedY, {
        epochs: 100,
        shuffle: true,
        batchSize: 32,
        callbacks: {
            onEpochEnd: (epoch, log) => console.log(epoch, log),
        },
    });
    console.log("Model Trained");

    return model;
};
