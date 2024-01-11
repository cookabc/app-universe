'use client';

import {CopyOutlined, LoadingOutlined} from "@ant-design/icons";
import {useState} from "react";
import Image from "next/image";
import "@/app/styles/chat.css";
import DefaultPrompt from "./components/DefaultPrompt";
import TextComponent from "./components/Text";

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            "id": 2469,
            "session_id": "1",
            "prompt": "创客",
            "response": " 创客（Maker）是指那些热衷于创新、创造和动手实践的人。他们通常热衷于探索新技术、科学和工程领域，通过自己动手制作项目，将自己的想法付诸实践。创客运动是一场全球性的 DIY（自己动手制作）运动，旨在鼓励个人或团队通过创新、发明和分享，共同推动科技和社会的进步。创客空间（Maker Space）是创客们聚集、交流和分享资源的场所，通常配备有各种工具、设备和资源，以便创客们可以在这里进行各种项目制作和创新活动。",
            "created_at": "2023-09-14 10:23:32.272671 +00:00"
        },
        {
            "id": 2459,
            "session_id": "1",
            "prompt": "语音识别和语音合成生活中有什么应用",
            "response": " 语音识别和语音合成技术在现实生活中有许多应用，以下是一些常见的例子：\n\n1. 智能手机：语音识别技术使得我们可以通过语音命令来操作智能手机，例如打电话、发短信、设置提醒等。语音合成技术则可以将文字内容转换为语音，方便我们阅读短信、邮件等。\n\n2. 智能家居：通过语音识别和语音合成技术，我们可以用语音控制家里的智能设备，如智能灯泡、智能电视、智能空调等。\n\n3. 导航系统：语音识别技术可以实现语音导航，让驾驶者在行驶过程中通过语音指令获取导航信息。语音合成技术则可以将导航信息转换为语音播报，帮助驾驶者更好地了解道路情况。\n\n4. 客服热线：语音识别技术可以用于自动语音应答系统，帮助用户快速找到所需的信息。语音合成技术可以让机器人以自然的方式与用户交流，提高用户体验。\n\n5. 教育领域：语音识别技术可以用于口语评测，帮助学生提高口语表达能力。语音合成技术可以用于制作有声读物，方便学生随时随地进行学习。\n\n6. 医疗领域：语音识别技术可以用于电子病历系统，让医生通过语音输入患者信息，提高工作效率。语音合成技术可以用于医疗教育、康复训练等方面，帮助患者恢复语言能力。\n\n7. 娱乐领域：语音识别和语音合成技术在游戏、动画、电影等领域有广泛应用，例如语音识别技术可以用于实现语音控制的游戏操作，语音合成技术可以用于制作动画角色的配音。\n\n这些只是语音识别和语音合成技术在生活中的一部分应用，随着技术的发展，未来它们将在更多领域发挥重要作用。",
            "created_at": "2023-09-14 08:04:41.507500 +00:00"
        },
        {
            "id": 2460,
            "session_id": "1",
            "prompt": "孩子通过上AI思维课能够获得的收获有哪几类",
            "response": " AI 思维课主要是指通过人工智能技术和思维教育理念相结合的课程，旨在培养孩子的逻辑思维、创新能力、问题解决能力等。孩子通过 AI 思维课可以获得以下几类收获：\n\n1. 培养逻辑思维能力：AI 思维课通常会通过各种逻辑游戏、编程任务等帮助孩子建立严密的逻辑思维，提高分析和解决问题的能力。\n\n2. 提高创新能力：AI 思维课注重培养孩子的创新意识，鼓励他们用不同的方法解决问题，激发他们的创造力和想象力。\n\n3. 增强问题解决能力：在 AI 思维课中，孩子需要面对各种挑战和难题，通过学习人工智能技术和思维方法，他们可以更好地应对问题，找到解决方案。\n\n4. 培养团队协作能力：AI 思维课通常以项目制学习为主，孩子需要与团队成员一起合作完成任务，这有助于培养他们的团队协作能力和沟通技巧。\n\n5. 提高科技素养：通过 AI 思维课，孩子可以了解人工智能技术的基本原理和应用，提高自身的科技素养，为未来社会做好准备。\n\n6. 增强实践能力：AI 思维课注重让孩子动手实践，通过实际操作和尝试，孩子可以更好地掌握所学知识，提高自身的实践能力。\n\n7. 培养跨学科综合能力：AI 思维课通常涉及多个学科领域，如数学、计算机科学、设计等，孩子可以在学习过程中培养跨学科的综合能力。\n\n总之，孩子通过 AI 思维课可以获得多方面的成长，为未来的学习和生活打下坚实的基础。",
            "created_at": "2023-09-14 08:28:48.882991 +00:00"
        },
        {
            "id": 2463,
            "session_id": "1",
            "prompt": "翻译：Computers perceive the world using sensors. Perception is the process of extracting meaning from sensory signals. Making computers “see” and “hear” well enough for practical use is<br>one of the most significant achievements of AI to date.",
            "response": " 计算机通过传感器感知世界。感知是从感官信号中提取意义的过程。使计算机“看”和“听”到足以用于实际应用的程度是迄今为止 AI 最重大的成就之一。",
            "created_at": "2023-09-14 08:50:40.871341 +00:00"
        },
        {
            "id": 2470,
            "session_id": "1",
            "prompt": "图像分类、图像识别在日常生活中的应用",
            "response": " 图像分类和图像识别是计算机视觉领域的重要技术，它们在日常生活中的应用非常广泛。以下是一些常见的应用场景：\n\n1. 照片分类和检索：我们通常会使用手机或电脑对照片进行分类和检索，通过图像分类技术，可以将相似类型的照片归为一类，方便我们查找和分享。\n\n2. 自动驾驶：自动驾驶技术中，图像识别技术可以帮助汽车识别道路、行人、车辆等物体，从而实现安全驾驶。\n\n3. 人脸识别：人脸识别技术可以应用于手机解锁、金融支付、安防监控等领域。通过识别人脸特征，可以实现快速、安全的身份验证。\n\n4. 物体识别：在购物、仓储、物流等领域，物体识别技术可以帮助识别商品、快速盘点库存、提高物流效率等。\n\n5. 医疗诊断：图像识别技术在医疗领域也有广泛应用，如辅助医生识别病灶、分析影像资料等，提高诊断准确率。\n\n6. 智能家居：在智能家居领域，图像识别技术可以用于识别家庭成员、判断室内环境等，实现智能化的家居管理。\n\n7. 安全检查：在机场、火车站等场所，通过图像识别技术对行李、包裹等进行安全检查，可以有效预防恐怖袭击等事件。\n\n8. 广告推送：在互联网上，通过图像识别技术分析用户的浏览行为，可以实现精准的广告推送，提高广告效果。\n\n9. 教育：在在线教育领域，图像识别技术可以帮助识别手写字体、分析学生作业等，提高教育质量。\n\n总之，图像分类和图像识别技术已经渗透到我们日常生活的方方面面，为我们带来了很多便利和价值。随着人工智能技术的不断发展，这些应用场景将会越来越丰富。",
            "created_at": "2023-09-14 11:00:47.570207 +00:00"
        },
        {
            "id": 2471,
            "session_id": "1",
            "prompt": "AI的训练集，测试集和交叉验证集的区别",
            "response": " 在人工智能领域，训练集、测试集和交叉验证集是数据集的三个重要部分，它们在模型训练和评估过程中扮演着不同的角色。\n\n1. 训练集（Training Set）：训练集是用于训练模型的数据样本集合。在训练过程中，模型会通过学习训练集中的数据，从而学习到数据的特征和规律，进而完成模型的训练。训练集的目的是让模型学会如何处理和预测新的数据。\n\n2. 测试集（Test Set）：测试集是用于评估模型性能的数据样本集合。在模型训练完成后，我们会将测试集的数据输入到模型中，让模型进行预测和处理。通过对比模型在测试集上的预测结果和实际结果，我们可以评估模型的性能，如准确率、召回率、F1 值等。测试集的目的是检验模型在未知数据上的泛化能力。\n\n3. 交叉验证集（Cross Validation Set）：交叉验证集是一种更复杂的数据集划分方法。交叉验证的过程是将数据集划分为多个子集（如 K 折交叉验证），每次选取其中一个子集作为验证集，其他子集作为训练集，循环进行训练和验证。交叉验证的目的是评估模型的稳定性和泛化能力，同时可以用于模型参数调优。\n\n总结一下，训练集用于训练模型，测试集用于评估模型性能，交叉验证集用于评估模型稳定性和参数调优。在实际应用中，我们需要合理地划分数据集，以便更好地训练和评估模型。",
            "created_at": "2023-09-14 15:07:41.047399 +00:00"
        },
        {
            "id": 2472,
            "session_id": "1",
            "prompt": "预训练模型是什么意思",
            "response": " 预训练模型是一种人工智能模型，它使用大量的未标记数据（例如，大规模的文本、图像或语音数据集）进行训练，以便在后续任务中提高其性能。预训练模型可以捕捉到数据中的通用模式和知识，从而使其能够适应各种特定任务。预训练模型可以是无监督的（仅使用未标记数据）或半监督的（使用未标记和标记数据）。\n\n预训练模型在自然语言处理、计算机视觉和语音识别等领域得到了广泛应用。例如，BERT（Bidirectional Encoder Representations from Transformers）是一种用于自然语言处理的预训练模型，GPT（Generative Pre-trained Transformer）是一种用于自然语言处理的半监督预训练模型，ResNet（Deep Residual Network）是一种用于计算机视觉的预训练模型。",
            "created_at": "2023-09-14 15:47:30.858345 +00:00"
        }]);

    const onCopy = (text: string) => {
        // Handle copy functionality here
    };

    return (<div className="relative flex h-full max-w-full flex-1 overflow-hidden">
        <div className="chat-right overflow-y-auto bg-[var(--chat-bg-color)] w-full h-full scroll-smooth">
            <div className="message-list py-4" id="scrollRef">
                {loading && (
                    <div className="absolute w-full h-full flex justify-center items-center text-3xl">
                        <LoadingOutlined/>
                    </div>
                )}
                {!loading && messages.length > 0 && messages.map((message: any) => {
                    return (<div key={message.id}>
                        <div className="group message-item w-full">
                            <div
                                className="flex p-4 gap-2 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-5xl md:py-4 lg:px-0 m-auto">
                                <div className="flex-shrink-0 flex flex-col relative items-end">
                                    <div className="w-10">
                                        <Image src="/images/chat/people.jpg" className="w-full h-full object-cover"
                                               alt="" width={40} height={40}/>
                                    </div>
                                </div>
                                <div
                                    className="message-content relative bg-[var(--ant-primary-color-3)] flex flex-col gap-1 md:gap-3 p-4 lg:w-[calc(100%-115px)] rounded-xl">
                                    <TextComponent text={message.prompt}/>
                                    <div className="flex">
                                        <button type="button" className="ml-auto"
                                                onClick={() => onCopy(message.prompt)}>
                                            <CopyOutlined/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="group message-item w-full">
                            <div
                                className="flex p-4 gap-2 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-5xl md:py-4 lg:px-0 m-auto">
                                <div className="flex-shrink-0 flex flex-col relative items-end">
                                    <div className="w-10">
                                        <Image src="/images/chat/ai_robot.svg" className="w-full h-full object-cover"
                                               alt="" width={40} height={40}/>
                                    </div>
                                </div>
                                <div
                                    className="message-content relative flex w-[calc(100%-50px)] flex-col lg:w-[calc(100%-115px)] bg-white p-4 rounded-xl">
                                    <TextComponent text={message.response}/>
                                    <div className="flex">
                                        <button type="button" className="ml-auto" title="复制"
                                                onClick={() => onCopy(message.response)}>
                                            <CopyOutlined/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)
                })}
                {!loading && messages.length === 0 && <DefaultPrompt/>}
                <div className="h-32 md:h-48 flex-shrink-0"></div>
            </div>
        </div>
    </div>)
}
