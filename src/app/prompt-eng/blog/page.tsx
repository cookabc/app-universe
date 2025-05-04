import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function DesignTipsArticle() {
	return (
		<div className={`max-w-4xl mx-auto px-4 py-8 ${inter.className}`}>
			<h1 className="text-4xl font-bold text-center mb-8 animate-fade-in">
				设计公司官网设计心得分享
			</h1>

			<div className="mb-8 animate-fade-in">
				<Image
					src="/images/design-concept.jpg"
					alt="设计理念"
					width={800}
					height={400}
					className="rounded-lg shadow-lg mx-auto"
				/>
			</div>

			<p className="text-lg mb-8 animate-fade-in">
				最近发现，很多人在设计公司官网时，不知道需要考虑哪些因素。虽然市面上有很多网站模板可供选择，但大家往往不知道这些模板之间的区别。今天，我想分享一些自己的心得，希望对大家有所帮助。
			</p>

			<section className="mb-12 animate-slide-in">
				<h2 className="text-2xl font-semibold mb-4">
					选择适合的视觉风格，而非一味追求高大上
				</h2>
				<div className="flex flex-col md:flex-row items-center gap-8">
					<Image
						src="/images/style-comparison.jpg"
						alt="不同风格的网站界面对比"
						width={400}
						height={300}
						className="rounded-lg shadow-md"
					/>
					<p className="text-lg">
						很多网站喜欢用酷炫的效果来增加视觉冲击力，但你是否想过这样做的原因？如果你的网站是学术类的，也许更适合一个有书卷气、传统的设计风格；如果你是一个食谱网站，那么温馨的设计可能更符合用户的期望。
						<br />
						<br />
						<strong>合适比酷炫重要得多。</strong>
					</p>
				</div>
			</section>

			<section className="mb-12 animate-slide-in">
				<h2 className="text-2xl font-semibold mb-4">
					使用与文字配合良好的插图
				</h2>
				<div className="flex flex-col md:flex-row-reverse items-center gap-8">
					<Image
						src="/images/text-image-harmony.jpg"
						alt="文字与插图完美结合"
						width={400}
						height={300}
						className="rounded-lg shadow-md"
					/>
					<p className="text-lg">
						你不需要大师级的插画或摄影作品，只要用户一扫而过就能理解你的产品、服务或特色，那就是好的插图。
						<br />
						<br />
						视觉元素（尤其是插图）的作用是帮助用户理解内容，不要为了插图而插图。
					</p>
				</div>
			</section>

			<section className="mb-12 animate-slide-in">
				<h2 className="text-2xl font-semibold mb-4">
					UI的重要性在于体现专业性
				</h2>
				<div className="flex flex-col md:flex-row items-center gap-8">
					<Image
						src="/images/professional-ui.jpg"
						alt="细节精良的网站设计"
						width={400}
						height={300}
						className="rounded-lg shadow-md"
					/>
					<p className="text-lg">
						UI的美观没有尽头，但重点在于体现专业性，而不是为了好看而好看。
						<br />
						<br />
						很多人选择了一个漂亮的模板，但在定制化的过程中忽略了对齐、视觉统一、响应式设计等细节。用户能在一个细节精良的网站背后看到一个靠谱、专业的团队，反之则会觉得不专业。
					</p>
				</div>
			</section>

			<section className="mb-12 animate-slide-in">
				<h2 className="text-2xl font-semibold mb-4">不要直接放软件产品截图</h2>
				<div className="flex flex-col md:flex-row-reverse items-center gap-8">
					<Image
						src="/images/screenshot-vs-illustration.jpg"
						alt="复杂截图与简化示意图对比"
						width={400}
						height={300}
						className="rounded-lg shadow-md"
					/>
					<p className="text-lg">
						用户浏览网站时，并没有处在产品使用的场景和心流中，直接放截图会一下子把过多的细节呈现给用户，无法让他们快速理解产品或功能的目的、作用和特点。
						<br />
						<br />
						因此，更好的做法是制作一些产品和功能的<strong>"示意图"</strong>
						。这种示意图介于截图和插画之间，简化了界面细节，放大了界面特点。
					</p>
				</div>
			</section>

			<section className="p-6 rounded-lg shadow-inner animate-fade-in">
				<h2 className="text-2xl font-semibold mb-4">总结</h2>
				<p className="text-lg">
					总的来说，这些技巧背后的哲学就是——
					<strong>清楚设计的原因（Design Rationale）</strong>。
					<br />
					<br />
					当你心里清楚每个设计决策背后的原因，就能避免陷入不断修改设计的漩涡，或者花费大量时间浏览和选择模板。
					<br />
					<br />
					希望以上心得能对正在设计公司官网的你有所帮助！
				</p>
				<Image
					src="/images/design-rationale.jpg"
					alt="设计背后的原因"
					width={600}
					height={300}
					className="rounded-lg shadow-md mb-4"
				/>
			</section>
		</div>
	);
}
