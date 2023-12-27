import Image from "next/image";
import Link from "next/link";

interface Item {
    url: string;
    imgUrl: string;
    title: string;
    description: string;
}

interface Section {
    name: string;
    children: Item[];
}

const sections: Section[] = [
    {
        name: '实验',
        children: [
            {
                title: '图像分类模型训练',
                url: '/train/image',
                imgUrl: '/images/train_image_fv.png',
                description: '上传图片文件或摄像头拍摄照片，进行图像分类模型训练。'
            },
            {
                title: '声音分类模型训练',
                url: '/train/image',
                imgUrl: '/images/train_audio_fv.png',
                description: '上传音频文件或麦克风录制音频，进行音频分类模型训练。'
            },
            {
                title: '姿势分类模型训练',
                url: '/train/pose',
                imgUrl: '/images/train_pose_fv.png',
                description: '上传图片文件或摄像头拍摄照片，进行姿势模型训练。'
            },
            {
                title: 'AI训练场',
                url: 'https://train-agischool.vercel.app',
                imgUrl: '/images/train_audio.png',
                description: '上传图片文件或摄像头拍摄照片，进行图像分类模型训练。'
            }
        ]
    },
    {
        name: '工具',
        children: [
            {
                title: '人体检测',
                url: '/pose',
                imgUrl: '/images/tool_pose.png',
                description: 'AI是如何识别出我的动作的？看一下就明白了。'
            },
            {
                title: '人脸检测',
                url: '/face',
                imgUrl: '/images/tool_face.png',
                description: '一起来了解下人脸打卡机是如何实现的吧！'
            },
            {
                title: '聊天助手',
                url: 'https://chat-agischool.vercel.app',
                imgUrl: '/images/tool_chat.png',
                description: 'GPT模型是如何帮助大家提高效率的？这里有好多场景等你来探索，快来试试吧！'
            },
            {
                title: "OpenAI工具",
                url: "/openai",
                imgUrl: "/images/tool_openai.png",
                description: "AI是如何理解意图、识别情绪、回答问题的？这里可以找到答案。"
            }
        ]
    },
    {
        name: '游戏',
        children: [
            {
                title: '图像分类-吃豆人',
                url: '/pacman',
                imgUrl: '/images/game_pacman.png',
                description: '爸爸小时候用键盘和手柄玩吃豆人（Pacman）游戏，我现在用手势指挥我的吃豆人。'
            },
            {
                title: '声音分类-贪食蛇',
                url: '/snake',
                imgUrl: '/images/game_snake.png',
                description: '用手势指挥已经不酷了，让我用声音来控制贪食蛇吧，好Cool!'
            },
            {
                title: '声音分类-寻找布谷鸟',
                url: '/cuckoo',
                imgUrl: '/images/game_cuckoo.jpg',
                description: '亚马逊森林中，一种布谷鸟就要灭绝了，我们来帮助科学家找到布谷鸟，保护好它们吧。'
            },
            {
                title: '强化学习-井字棋',
                url: '/tic-tac-toe',
                imgUrl: '/images/game_tic-tac-toe.png',
                description: '让我们一同来解密AI是如何学会下棋的吧！'
            },
        ]
    }
];

export default function Home() {
    return (<>
        {sections.map((section, index) => (
            <div key={index} className="py-4">
                <div className="bg-white sticky top-[64px] py-2 z-10 px-[10%] text-2xl">
                    <h2 className="text-[var(--ant-primary-color)] relative flex items-center before:content-empty before:block before:w-1 before:h-6 before:bg-[#7260af] before:mr-2">
                        {section.name}
                    </h2>
                </div>
                <div className="px-[10%] py-4">
                    <div className="flex flex-wrap mx-[-1rem] gap-y-8">
                        {section.children.map((item, itemIdx) => (
                            <div key={itemIdx}
                                 className="2xl:w-1/4 xl:w-1/4 lg:w-1/3 md:w-1/2 sm:w-full w-full px-4">
                                <Link href={item.url} target="_blank"
                                      className="block h-full border-[1px] rounded-xl hover:shadow-xl">
                                    <div className="rounded-xl">
                                        <div className="w-full h-[200px] relative">
                                            <Image
                                                fill
                                                src={item.imgUrl}
                                                alt={item.title}
                                                className="object-cover rounded-ss-xl rounded-se-xl"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                        <div className="p-[24px] rounded-xl">
                                            <div title={item.title}
                                                 className="mb-2 text-ellipsis text-[var(--ant-primary-color)] font-bold">
                                                {item.title}
                                            </div>
                                            <div title={item.description}
                                                 className="line-clamp-4 text-sm text-slate-500">
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </>)
}
