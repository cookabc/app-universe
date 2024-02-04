export type MoteCamAdviceMessage = {
    message: string
    fulfilled: boolean
}

export type MoteCamAdviceType = {
    expression: MoteCamAdviceMessage
    age: MoteCamAdviceMessage
    faceSize: MoteCamAdviceMessage
    facePosition: MoteCamAdviceMessage
}

const MoteCamMessage = ({expression, age, faceSize, facePosition,}: MoteCamAdviceType) => {
    return (<div>
        <div>{expression.message}</div>
        <div>{age.message}</div>
        <div>{faceSize.message}</div>
        <div>{facePosition.message}</div>
    </div>)
}

export {MoteCamMessage}
