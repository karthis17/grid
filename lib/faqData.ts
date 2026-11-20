import type { Locale } from "./i18n/types";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  list?: string[];
  category?: string;
}

export const faqEn: FaqItem[] = [
  {
    id: 1,
    question: "What is architectural visualization?",
    answer:
      "Architectural visualization (archviz) turns drawings, CAD files and 3D models into photorealistic images and films of a project before it’s built. Developers use it to sell. Architects use it to show design intent and get approvals. Everyone involved gets the same clear picture of the finished space.",
    category: "General",
  },
  {
    id: 2,
    question: "What services does Lucid Dream Studio offer?",
    answer: "",
    list: [
      "Photorealistic exterior and interior stills",
      "Cinematic architectural walkthroughs and films",
      "Aerial and context views with matte-painted surroundings",
      "Real-time and interactive visualization in Unreal Engine",
      "Concept visuals for early-stage design and competitions",
      "Post-production, VFX and compositing for marketing campaigns",
    ],
    category: "Services",
  },
  {
    id: 3,
    question: "What makes Lucid Dream Studio different?",
    answer:
      "We’re led by a trained architect, so we read your drawings the way you designed them. We also treat every project like a film. We think about light, mood, camera and story, not just accuracy, so the result makes buyers and approval panels feel something about the space.",
    category: "General",
  },
  {
    id: 4,
    question: "How long does a project take?",
    answer:
      "That depends on how big and detailed the project is. A single still usually takes about [X] working days. A full animation typically takes [X–X] weeks. Complete drawings, material references and a clear brief at the start are the quickest way to cut the timeline.",
    category: "Timeline & Pricing",
  },
  {
    id: 5,
    question: "How much does 3D rendering cost?",
    answer:
      "Price depends on the number of views, how detailed the scene is, and whether you need stills, animation or both. Stills are priced per image and animations per minute of finished film. Send us your drawings and requirements, and we’ll send a clear quote with no hidden costs.",
    category: "Timeline & Pricing",
  },
  {
    id: 6,
    question: "What do you need from us to get started?",
    answer:
      "Architectural drawings (CAD, PDF, Revit, SketchUp or 3ds Max), elevations and sections, material and finish references, and any mood images you like. If the design isn’t final yet, we can work from sketches and develop the visuals with you.",
    category: "Process",
  },
  {
    id: 7,
    question: "How many revisions are included?",
    answer:
      "Each project includes [X] rounds of revisions. We share drafts at key stages (camera angles, clay renders, then final lighting and materials), so changes happen early and nothing at the end is a surprise.",
    category: "Process",
  },
  {
    id: 8,
    question: "Who do you work with?",
    answer:
      "Real estate developers, architects, interior designers, landscape designers, construction companies, and marketing or branding agencies. We work with anyone who needs to sell, pitch or approve a space before it exists.",
    category: "Collaboration",
  },
  {
    id: 9,
    question: "Do you work with international clients?",
    answer:
      "Yes. We’re based in Chennai, India, and work with clients in India and overseas. We schedule reviews around your time zone, communicate clearly in English, and deliver files in the formats and resolutions your market needs.",
    category: "Collaboration",
  },
  {
    id: 10,
    question: "Can you also make marketing content beyond renders?",
    answer:
      "Yes. Along with visualization, we can produce cinematic brand films, project launch videos, social media cuts, and architectural photography and videography of completed projects.",
    category: "Services",
  },
  {
    id: 11,
    question: "How do I start a project with you?",
    answer:
      "Email or call us with your drawings and a short brief. We’ll review them, suggest the best set of views or shots, and send a quote and timeline, usually within [24–48] hours.",
    category: "Process",
  },
];

export const faqTa: FaqItem[] = [
  {
    id: 1,
    question: "கட்டிடக்கலை காட்சிப்படுத்தல் (Architectural Visualization) என்றால் என்ன?",
    answer:
      "கட்டிடக்கலை காட்சிப்படுத்தல் (archviz) என்பது வரைபடங்கள், CAD கோப்புகள் மற்றும் 3D மாடல்களை ஒரு திட்டம் கட்டப்படுவதற்கு முன்பே தத்ரூபமான புகைப்படங்களாகவும் திரைப்படங்களாகவும் மாற்றுகிறது. டெவலப்பர்கள் திட்டத்தை விற்கவும், கட்டிடக்கலைஞர்கள் தங்கள் வடிவமைப்பு நோக்கத்தை வெளிப்படுத்தி அனுமதிகளைப் பெறவும் இதைப் பயன்படுத்துகின்றனர். இதில் ஈடுபடும் அனைவருக்கும் கட்டி முடிக்கப்பட்ட இடத்தைப்பற்றிய தெளிவான பார்வை கிடைக்கிறது.",
    category: "பொதுவானவை",
  },
  {
    id: 2,
    question: "லூசிட் ட்ரீம் ஸ்டுடியோ என்னென்ன சேவைகளை வழங்குகிறது?",
    answer: "",
    list: [
      "தத்ரூபமான வெளிப்புற மற்றும் உட்புற ஸ்டில் படங்கள்",
      "சினிமா தரத்திலான கட்டிடக்கலை நடைமுறை உலாக்கள் மற்றும் திரைப்படங்கள்",
      "மேட்-பெயிண்டிங் சூழலுடன் கூடிய வான்வழி மற்றும் சூழல் காட்சிகள்",
      "அன்ரியல் என்ஜினில் (Unreal Engine) நிகழ்நேர மற்றும் ஊடாடும் காட்சிப்படுத்தல்",
      "ஆரம்ப கட்ட வடிவமைப்பு மற்றும் போட்டிகளுக்கான கருத்துக் காட்சிகள்",
      "சந்தைப்படுத்தல் பிரச்சாரங்களுக்கான போஸ்ட்-ப்ரொடக்ஷன், VFX மற்றும் கம்போசிட்டிங்",
    ],
    category: "சேவைகள்",
  },
  {
    id: 3,
    question: "லூசிட் ட்ரீம் ஸ்டுடியோவை தனித்துவமாக்குவது எது?",
    answer:
      "நாங்கள் ஒரு பயிற்சி பெற்ற கட்டிடக்கலைஞரால் வழிநடத்தப்படுகிறோம், எனவே உங்கள் வரைபடங்களை நீங்கள் வடிவமைத்த நோக்கத்துடனேயே எங்களால் துல்லியமாகப் படிக்க முடிகிறது. மேலும் ஒவ்வொரு திட்டத்தையும் ஒரு திரைப்படம் போலவே அணுகுகிறோம். வெறும் துல்லியம் மட்டுமல்லாமல் வெளிச்சம், மனநிலை, கேமரா கோணம் மற்றும் கதை ஆகியவற்றையும் ஆழமாக சிந்திக்கிறோம். இதனால் எங்கள் காட்சிகள் வாங்குபவர்களுக்கும் ஒப்புதல் குழுவினருக்கும் அந்த இடத்தைப்பற்றிய ஆழமான உணர்வை ஏற்படுத்துகின்றன.",
    category: "பொதுவானவை",
  },
  {
    id: 4,
    question: "ஒரு திட்டத்தை முடிக்க எவ்வளவு காலம் ஆகும்?",
    answer:
      "திட்டத்தின் அளவு மற்றும் விவரங்களைப் பொறுத்து காலம் மாறுபடும். ஒரு தனிப்பட்ட ஸ்டில் படத்திற்கு வழக்கமாக [X] வேலை நாட்கள் ஆகும். ஒரு முழுமையான அனிமேஷனுக்கு பொதுவாக [X–X] வாரங்கள் தேவைப்படும். தொடக்கத்திலேயே முழுமையான வரைபடங்கள், மெட்டீரியல் குறிப்புகள் மற்றும் தெளிவான சுருக்கக்குறிப்பை வழங்குவது கால அளவை கணிசமாகக் குறைப்பதற்கான விரைவான வழியாகும்.",
    category: "கால அளவு & கட்டணம்",
  },
  {
    id: 5,
    question: "3D ரெண்டரிங் கட்டணம் எவ்வளவு?",
    answer:
      "காட்சிகளின் எண்ணிக்கை, காட்சியமைப்பின் விவரங்கள் மற்றும் உங்களுக்கு ஸ்டில் படங்கள் தேவையா, அனிமேஷன் தேவையா அல்லது இரண்டும் தேவையா என்பதைப் பொறுத்து கட்டணம் மாறுபடும். ஸ்டில்கள் ஒரு படத்திற்கான கட்டணமாகவும், அனிமேஷன்கள் முடிவடைந்த திரைப்படத்தின் நிமிடத்தின் அடிப்படையிலும் நிர்ணயிக்கப்படுகின்றன. உங்கள் வரைபடங்களையும் தேவைகளையும் எங்களுக்கு அனுப்புங்கள், மறைமுகக் கட்டணங்கள் ஏதுமின்றி தெளிவான விலை மதிப்பீட்டை உங்களுக்கு அனுப்புவோம்.",
    category: "கால அளவு & கட்டணம்",
  },
  {
    id: 6,
    question: "திட்டத்தைத் தொடங்க உங்களிடம் நாங்கள் என்ன வழங்க வேண்டும்?",
    answer:
      "கட்டிடக்கலை வரைபடங்கள் (CAD, PDF, Revit, SketchUp அல்லது 3ds Max), எலிவேஷன்கள் மற்றும் பிரிவுகள், மெட்டீரியல் மற்றும் ஃபினிஷிங் குறிப்புகள், மற்றும் நீங்கள் விரும்பும் மூட் படங்கள். வடிவமைப்பு இன்னும் இறுதியாகவில்லை என்றால், நாங்கள் உங்கள் ஆரம்பக்கட்ட வரைபடங்களில் இருந்தே உங்களுடன் இணைந்து காட்சிகளை உருவாக்கத் தொடங்கலாம்.",
    category: "செயல்முறை",
  },
  {
    id: 7,
    question: "எத்தனை திருத்தங்கள் (Revisions) சேர்க்கப்பட்டுள்ளன?",
    answer:
      "ஒவ்வொரு திட்டத்திலும் [X] சுற்றுகள் திருத்தங்கள் சேர்க்கப்பட்டுள்ளன. கேமரா கோணங்கள், க்ளே ரெண்டர்கள் (Clay renders), பின்னர் இறுதி வெளிச்சம் மற்றும் மெட்டீரியல்கள் போன்ற முக்கிய கட்டங்களில் வரைவு மாதிரிகளைப் பகிர்ந்துகொள்கிறோம், எனவே மாற்றங்கள் முன்கூட்டியே நிகழ்கின்றன மற்றும் இறுதியில் எந்த ஆச்சரியமும் ஏற்படுவதில்லை.",
    category: "செயல்முறை",
  },
  {
    id: 8,
    question: "நீங்கள் யாருடன் இணைந்து பணியாற்றுகிறீர்கள்?",
    answer:
      "ரியல் எஸ்டேட் டெவலப்பர்கள், கட்டிடக்கலைஞர்கள், உட்புற வடிவமைப்பாளர்கள், நிலப்பரப்பு வடிவமைப்பாளர்கள், கட்டுமான நிறுவனங்கள் மற்றும் சந்தைப்படுத்தல் அல்லது பிராண்டிங் நிறுவனங்கள். ஒரு இடம் உருவாக்கப்படுவதற்கு முன்பே அதை விற்க, விளக்க அல்லது ஒப்புதல் பெற விரும்பும் எவருடனும் நாங்கள் இணைந்து பணியாற்றுகிறோம்.",
    category: "கூட்டுப்பணி",
  },
  {
    id: 9,
    question: "நீங்கள் சர்வதேச வாடிக்கையாளர்களுடன் பணியாற்றுகிறீர்களா?",
    answer:
      "ஆம். நாங்கள் இந்தியாவின் சென்னையில் அமைந்திருக்கிறோம், மேலும் இந்தியா மற்றும் வெளிநாடுகளில் உள்ள வாடிக்கையாளர்களுடன் பணியாற்றுகிறோம். உங்கள் நேர மண்டலத்திற்கு (Time zone) ஏற்ப மறுஆய்வுகளை திட்டமிடுகிறோம், ஆங்கிலத்தில் தெளிவாகத் தொடர்பு கொள்கிறோம், மற்றும் உங்கள் சந்தைக்குத் தேவையான வடிவங்கள் மற்றும் தெளிவுத்திறன்களில் கோப்புகளை வழங்குகிறோம்.",
    category: "கூட்டுப்பணி",
  },
  {
    id: 10,
    question: "ரெண்டர்களைத் தாண்டி சந்தைப்படுத்தல் உள்ளடக்கங்களையும் உருவாக்க முடியுமா?",
    answer:
      "ஆம். காட்சிப்படுத்தலுடன் சேர்த்து சினிமா தர பிராண்ட் திரைப்படங்கள், திட்ட வெளியீட்டு வீடியோக்கள், சமூக ஊடக குறும்பதிவுகள் மற்றும் முடிக்கப்பட்ட திட்டங்களின் கட்டிடக்கலை புகைப்படம் மற்றும் வீடியோ பதிவுகளையும் எங்களால் உருவாக்க முடியும்.",
    category: "சேவைகள்",
  },
  {
    id: 11,
    question: "உங்களுடன் ஒரு திட்டத்தை எவ்வாறு தொடங்குவது?",
    answer:
      "உங்கள் வரைபடங்கள் மற்றும் ஒரு சிறிய குறிப்புடன் எங்களுக்கு மின்னஞ்சல் அல்லது தொலைபேசி மூலம் தொடர்பு கொள்ளவும். நாங்கள் அவற்றை மதிப்பாய்வு செய்து, சிறந்த கோணங்கள் அல்லது காட்சிகளைப் பரிந்துரைப்போம், மேலும் பொதுவாக [24–48] மணி நேரத்திற்குள் விலை மதிப்பீடு மற்றும் காலக்கெடுவை அனுப்புவோம்.",
    category: "செயல்முறை",
  },
];

export const faqJa: FaqItem[] = [
  {
    id: 1,
    question: "建築ビジュアライゼーションとは何ですか？",
    answer:
      "建築ビジュアライゼーション（ArchViz）とは、図面やCADデータ、3Dモデルをもとに、建物が実際に建設される前にフォトリアルな画像や映像を制作する技術です。デベロッパーは販売促進に、建築家はデザインの意図を伝え承認を得るために活用します。プロジェクトに関わるすべての人が、完成後の空間について共通の明確なイメージを共有できます。",
    category: "概要",
  },
  {
    id: 2,
    question: "Lucid Dream Studioではどのようなサービスを提供していますか？",
    answer: "",
    list: [
      "フォトリアルな外観および内観の静止画パース",
      "シネマティックな建築ウォークスルー映像・ブランドムービー",
      "マットペイントによる周辺環境を含めた空撮・コンテクストビュー",
      "Unreal Engineを活用したリアルタイム＆インタラクティブ・ビジュアライゼーション",
      "初期設計やデザインコンペ向けのコンセプトビジュアル",
      "マーケティングキャンペーン用のポストプロダクション・VFX・コンポジット",
    ],
    category: "サービス",
  },
  {
    id: 3,
    question: "Lucid Dream Studioの強み・独自性は何ですか？",
    answer:
      "私たちは建築家出身のリーダーが率いているため、設計者の意図や図面の本質を深く理解することができます。また、すべてのプロジェクトを一つの映画のように捉えています。単なる正確さにとどまらず、光、空気感、カメラワーク、そしてストーリーを追求することで、購買層や審査会の人々の心を動かす空間体験を創り出します。",
    category: "概要",
  },
  {
    id: 4,
    question: "プロジェクトの納期・制作期間はどのくらいですか？",
    answer:
      "プロジェクトの規模やディテールによって異なります。静止画1点の場合、通常約[X]営業日程度かかります。完全なアニメーション制作には通常[X〜X]週間ほどを要します。着手時に完全な図面、素材・マテリアル資料、明確なご要望をご共有いただくことが、制作期間を最も短縮する鍵となります。",
    category: "期間・費用",
  },
  {
    id: 5,
    question: "3Dレンダリングの制作費用はどのくらいですか？",
    answer:
      "アングル数、シーンの精緻さ、静止画・アニメーション（またはその両方）の必要性によって変動します。静止画は1カット単位、アニメーションは完成尺（分数）単位でお見積りいたします。図面とご要件をお送りいただければ、追加の隠れた費用のない透明性の高いお見積書をご提示いたします。",
    category: "期間・費用",
  },
  {
    id: 6,
    question: "制作を開始するにあたり、何を用意すればよいですか？",
    answer:
      "建築図面（CAD、PDF、Revit、SketchUp、3ds Max等）、立面図・断面図、マテリアルや仕上げの仕様資料、お好みのイメージ・ムード写真をご用意ください。設計がまだ最終決定していない段階でも、手描きのスケッチや構想段階から協力してビジュアルを形にしていくことが可能です。",
    category: "制作の流れ",
  },
  {
    id: 7,
    question: "修正対応（リビジョン）は何回まで含まれますか？",
    answer:
      "各プロジェクトには[X]回のリビジョン（修正対応）が含まれています。カメラアングル決定、クレイレンダリング（白模型段階）、最終ライティングとマテリアル調整など、制作の節目ごとにドラフトを共有するため、初期段階で修正を反映でき、最終納品時に認識の齟齬が生じることはありません。",
    category: "制作の流れ",
  },
  {
    id: 8,
    question: "どのようなクライアントと協働していますか？",
    answer:
      "不動産デベロッパー、組織設計事務所・建築家、インテリアデザイナー、ランドスケープデザイナー、建設会社、マーケティング・ブランディングエージェンシーなどです。空間が実在する前に、販売・提案・承認を必要とするあらゆるプロフェッショナルと協働しています。",
    category: "協働・クライアント",
  },
  {
    id: 9,
    question: "海外のクライアントとも協働できますか？",
    answer:
      "はい。私たちはインド・チェンナイに拠点を置き、インド国内および世界各国のクライアントと協働しています。クライアントのタイムゾーンに合わせてレビューを調整し、英語でスムーズにコミュニケーションを行い、各国の市場基準に合わせた解像度とフォーマットで納品いたします。",
    category: "協働・クライアント",
  },
  {
    id: 10,
    question: "CGパース以外に、マーケティングコンテンツの制作も可能ですか？",
    answer:
      "はい、可能です。ビジュアライゼーションに加え、シネマティックなブランドムービー、プロジェクトローンチ映像、SNS向けショート動画、完成建物の建築写真・動画撮影までトータルでプロデュースいたします。",
    category: "サービス",
  },
  {
    id: 11,
    question: "プロジェクトの依頼・相談はどのように始めればよいですか？",
    answer:
      "図面資料と簡単なご要件を添えて、メールまたはお電話でお問い合わせください。内容を確認の上、最適なアングルやショットをご提案し、通常[24〜48]時間以内にお見積りとスケジュールをご案内いたします。",
    category: "制作の流れ",
  },
];

export const faqDataByLocale: Record<Locale, FaqItem[]> = {
  en: faqEn,
  ta: faqTa,
  ja: faqJa,
};

export const faqLabelsByLocale: Record<Locale, string> = {
  en: "Frequently Asked Questions",
  ta: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
  ja: "よくあるご質問",
};

/** Default English FAQ data */
export const faqData: FaqItem[] = faqEn;

/** Helper to retrieve localized FAQ data */
export function getFaqData(locale: Locale = "en"): FaqItem[] {
  return faqDataByLocale[locale] || faqDataByLocale.en;
}

/** Helper to retrieve localized FAQ section label */
export function getFaqLabel(locale: Locale = "en"): string {
  return faqLabelsByLocale[locale] || faqLabelsByLocale.en;
}

/**
 * Generates Schema.org FAQPage structured data for SEO.
 */
export function generateFaqJsonLd(items: FaqItem[] = faqData) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => {
      const listText =
        item.list && item.list.length > 0
          ? item.list.map((li) => `• ${li}`).join("\n")
          : "";
      const fullAnswer = item.answer
        ? `${item.answer}${listText ? `\n\n${listText}` : ""}`
        : listText;

      return {
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: fullAnswer,
        },
      };
    }),
  };
}
