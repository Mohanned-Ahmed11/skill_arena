/**
 * Skill Arena - Database & Questions Data Store
 * Contains subjects, quizzes (5 questions each, 10-minute duration),
 * explanations, and persistent local storage database.
 */

const SkillDatabase = {
  // Available Categories & Subjects
  categories: [
    {
      id: "basic_sciences",
      title: "العلوم الأساسية",
      titleEn: "Basic Sciences",
      description: "اختبارات متقدمة في القوانين الفيزيائية والمعادلات الرياضية وتطبيقاتها العلمية.",
      icon: "atom",
      subjects: [
        {
          id: "physics",
          title: "الفيزياء",
          titleEn: "Physics",
          badge: "Physics Fundamentals",
          icon: "⚛️",
          color: "#00d2d3",
          description: "الميكانيكا الكلاسيكية، قوانين نيوتن، الديناميكا الحرارية، والكهرومغناطيسية.",
          durationMinutes: 10,
          questionCount: 5,
          difficulty: "متوسط"
        },
        {
          id: "math",
          title: "الرياضيات",
          titleEn: "Mathematics",
          badge: "Advanced Math",
          icon: "📐",
          color: "#54a0ff",
          description: "الجبر، التفاضل والتكامل، المصفوفات، والهندسة التحليلية وحل المسائل.",
          durationMinutes: 10,
          questionCount: 5,
          difficulty: "متقدم"
        }
      ]
    },
    {
      id: "languages",
      title: "اللغات",
      titleEn: "Languages",
      description: "تحديات شاملة في القواعد، المفردات، البلاغة، واستيعاب النصوص المقروءة.",
      icon: "book",
      subjects: [
        {
          id: "arabic",
          title: "اللغة العربية",
          titleEn: "Arabic Language",
          badge: "Arabic Mastery",
          icon: "✒️",
          color: "#1dd1a1",
          description: "قواعد النحو والإعراب، البلاغة والأدب العربي، وفنون الصرف والمعاجم.",
          durationMinutes: 10,
          questionCount: 5,
          difficulty: "متوسط"
        },
        {
          id: "english",
          title: "اللغة الإنجليزية",
          titleEn: "English Language",
          badge: "English Fluency",
          icon: "🌐",
          color: "#48dbfb",
          description: "Grammar, Advanced Vocabulary, Idioms, Reading Comprehension, & Syntax.",
          durationMinutes: 10,
          questionCount: 5,
          difficulty: "متوسط"
        }
      ]
    },
    {
      id: "technology",
      title: "التكنولوجيا",
      titleEn: "Technology",
      description: "مسائل برمجية واقعية، هندسة البرمجيات، ومفاهيم الأمن السيبراني والشبكات.",
      icon: "laptop-code",
      subjects: [
        {
          id: "programming",
          title: "البرمجة",
          titleEn: "Programming",
          badge: "Code Arena",
          icon: "💻",
          color: "#5f27cd",
          description: "هياكل البيانات، الخوارزميات، مفاهيم الـ OOP، وتطوير تطبيقات الويب الحديثة.",
          durationMinutes: 10,
          questionCount: 5,
          difficulty: "متقدم"
        },
        {
          id: "cybersecurity",
          title: "الأمن السيبراني",
          titleEn: "Cyber Security",
          badge: "Security Defense",
          icon: "🛡️",
          color: "#ff6b6b",
          description: "التشفير، تحليل الثغرات، الحماية من الهجمات، وبروتوكولات أمان الشبكات.",
          durationMinutes: 10,
          questionCount: 5,
          difficulty: "متقدم"
        }
      ]
    }
  ],

  // Question Banks: Exactly 5 high quality questions per subject (10 minutes each)
  questions: {
    // 1. الفيزياء (Physics)
    physics: [
      {
        id: "phy_1",
        question: "أي مما يلي يمثل الصيغة الرياضية لقانون نيوتن الثاني في الحركة؟",
        options: [
          "القوة = الكتلة × التسارع (F = m × a)",
          "الطاقة = الكتلة × مربع السرعة (E = m × c²)",
          "الجسم الساكن يبقى ساكناً ما لم تؤثر عليه قوة",
          "لكل فعل رد فعل مساوٍ له في المقدار ومضاد له في الاتجاه"
        ],
        correctIndex: 0,
        explanation: "قانون نيوتن الثاني ينص على أن تسارع الجسم يتناسب طردياً مع القوة المؤثرة عليه وعكسياً مع كتلته، ويعبر عنه رياضياً بالمعادلة F = m × a."
      },
      {
        id: "phy_2",
        question: "ما هي وحدة قياس الشغل والطاقة في النظام الدولي للوحدات (SI)؟",
        options: [
          "الواط (Watt)",
          "الجول (Joule)",
          "النيوتن (Newton)",
          "الباسكال (Pascal)"
        ],
        correctIndex: 1,
        explanation: "الجول (Joule) هو الوحدة الدولية المعتمدة لقياس كل من الطاقة والشغل والحرارة، وهو يساوي نيوتن × متر."
      },
      {
        id: "phy_3",
        question: "ما هي سرعة الضوء التقريبية في الفراغ؟",
        options: [
          "300,000 متر في الثانية",
          "150,000 كيلومتر في الثانية",
          "300,000 كيلومتر في الثانية (3 × 10⁸ م/ث)",
          "3,000,000 كيلومتر في الساعة"
        ],
        correctIndex: 2,
        explanation: "تبلغ سرعة الضوء في الفراغ حوالي 299,792,458 متر في الثانية، أي ما يقارب 300 ألف كم/ث، وتعتبر السرعة القصوى في الكون."
      },
      {
        id: "phy_4",
        question: "ماذا ينص قانون أوم (Ohm's Law) في الدوائر الكهربائية؟",
        options: [
          "فرق الجهد = شدة التيار × المقاومة (V = I × R)",
          "القدرة = شدة التيار ÷ المقاومة (P = I / R)",
          "المقاومة = فرق الجهد × الشحنة (R = V × Q)",
          "التيار = المقاومة ÷ فرق الجهد (I = R / V)"
        ],
        correctIndex: 0,
        explanation: "قانون أوم ينص على أن فرق الجهد بين طرفي موصل يتناسب طردياً مع شدة التيار المار فيه، والصيغة هي V = I × R."
      },
      {
        id: "phy_5",
        question: "ما هي الظاهرة الفيزيائية المسؤولة عن تشتت الضوء الأبيض إلى ألوان الطيف عند مروره خلال منشور زجاجي؟",
        options: [
          "الانعكاس الكلي الداخلي",
          "الانكسار واختلاف معاملات الانكسار للأطوال الموجية",
          "الاستقطاب الضوئي",
          "الحيود والتداخل"
        ],
        correctIndex: 1,
        explanation: "يحدث تشتت الضوء بسبب انكسار كل طول موجي (لون) بزاوية انكسار مختلفة نظراً لاختلاف معامل انكسار الزجاج لكل لون."
      }
    ],

    // 2. الرياضيات (Mathematics)
    math: [
      {
        id: "mat_1",
        question: "في المثلث القائم الزاوية، إذا كان طولا ضلعي القائمة 6 سم و 8 سم، فما هو طول الوتر؟",
        options: [
          "14 سم",
          "10 سم",
          "12 سم",
          "100 سم"
        ],
        correctIndex: 1,
        explanation: "وفق نظرية فيثاغورس: مربع الوتر = 6² + 8² = 36 + 64 = 100. إذن طول الوتر = √100 = 10 سم."
      },
      {
        id: "mat_2",
        question: "ما هي مشتقة الدالة الرياضية f(x) = 3x² + 5x - 7 بالنسبة للمتغير x؟",
        options: [
          "f'(x) = 6x + 5",
          "f'(x) = 3x + 5",
          "f'(x) = 6x² + 5",
          "f'(x) = 6x - 7"
        ],
        correctIndex: 0,
        explanation: "باستخدام قاعدة مشتقة القوى: مشتقة 3x² هي 6x، ومشتقة 5x هي 5، ومشتقة الثابت -7 هي صفر، فتصبح النتيجة 6x + 5."
      },
      {
        id: "mat_3",
        question: "ما هو حل المعادلة اللوغاريتمية: log₂(x) = 5 ؟",
        options: [
          "x = 10",
          "x = 25",
          "x = 32",
          "x = 64"
        ],
        correctIndex: 2,
        explanation: "بالتحويل للصورة الأسية: x = 2⁵ = 2 × 2 × 2 × 2 × 2 = 32."
      },
      {
        id: "mat_4",
        question: "كم يساوي مجموع الزوايا الداخلية لأي شكل مضلع خماسي منتظم؟",
        options: [
          "360 درجة",
          "540 درجة",
          "720 درجة",
          "180 درجة"
        ],
        correctIndex: 1,
        explanation: "القانون العام لمجموع زوايا المضلع هو (n - 2) × 180. للخماسي: (5 - 2) × 180 = 3 × 180 = 540 درجة."
      },
      {
        id: "mat_5",
        question: "ما هي قيمة المحدد (Determinant) للمصفوفة ثنائية الأبعاد: | [3, 4], [2, 5] | ؟",
        options: [
          "7",
          "15",
          "23",
          "7-"
        ],
        correctIndex: 0,
        explanation: "قيمة المحدد للمصفوفة 2×2 تحسب بضرب عناصر القطر الرئيسي وطرح القطر الثانوي: (3 × 5) - (4 × 2) = 15 - 8 = 7."
      }
    ],

    // 3. البرمجة (Programming)
    programming: [
      {
        id: "prg_1",
        question: "في لغة JavaScript، ما الفرق الجوهري بين المعاملين == و === ؟",
        options: [
          "المعامل === يقارن القيمة والنوع معاً دون تحويل ضمني (Strict Equality)، بينما == يقوم بتحويل النوع (Type Coercion)",
          "المعامل == أسرع دائماً ولا يفحص القيم الفارغة",
          "المعامل === مخصص للكائنات والمصفوفات فقط",
          "لا يوجد أي فرق ولهما نفس السلوك تماماً"
        ],
        correctIndex: 0,
        explanation: "المعامل === هو Strict Equality Operator يفحص تطابق القيمة والنوع دون إجراء Type Coercion، بينما == يحول الأنواع ضمنياً قبل المقارنة."
      },
      {
        id: "prg_2",
        question: "ما هو التعقيد الزمني (Time Complexity) لعملية البحث الثنائي (Binary Search) في مصفوفة مرتبة؟",
        options: [
          "O(n)",
          "O(n²)",
          "O(log n)",
          "O(1)"
        ],
        correctIndex: 2,
        explanation: "البحث الثنائي يقسم نطاق البحث إلى النصف في كل خطوة، مما يجعل التعقيد الزمني له O(log n)."
      },
      {
        id: "prg_3",
        question: "أي من المبادئ التالية ليس من المبادئ الأربعة الأساسية للبرمجة كائنية التوجه (OOP)؟",
        options: [
          "التغليف (Encapsulation)",
          "التجميع التكراري (Recursion)",
          "الوراثة (Inheritance)",
          "تعدد الأشكال (Polymorphism)"
        ],
        correctIndex: 1,
        explanation: "المبادئ الأربعة للـ OOP هي: Encapsulation, Abstraction, Inheritance, Polymorphism. بينما Recursion هو أسلوب برمجي لحل المسائل."
      },
      {
        id: "prg_4",
        question: "في بنية البيانات (Stack - المكدس)، ما هو المبدأ الذي تتبعه عمليات الإضافة والحذف؟",
        options: [
          "FIFO (First In First Out)",
          "LIFO (Last In First Out)",
          "Random Access",
          "Priority Based"
        ],
        correctIndex: 1,
        explanation: "المكدس (Stack) يتبع مبدأ LIFO (الداخل آخراً يخرج أولاً)، حيث تضاف العناصر وتزال من نفس الطرف (Top)."
      },
      {
        id: "prg_5",
        question: "ما هي الوظيفة الأساسية لنمط التصميم Singleton في هندسة البرمجيات؟",
        options: [
          "إنشاء نسخ متعددة من الكائن لتوزيع الحمل",
          "ضمان وجود نسخة واحدة فقط (Single Instance) من الكائن مع توفير نقطة وصول عامة لها",
          "تحويل الكائنات إلى صيغة JSON لحفظها",
          "فصل واجهة المستخدم عن منطق الأعمال"
        ],
        correctIndex: 1,
        explanation: "نمط Singleton يضمن إنشاء كائن واحد فقط من الفئة (Class) على مستوى التطبيق بالكامل وتوفير نقطة وصول مركزية له."
      }
    ],

    // 4. الأمن السيبراني (Cyber Security)
    cybersecurity: [
      {
        id: "sec_1",
        question: "ما هو هجوم 'التصيد الاحتيالي' (Phishing) في الأمن السيبراني؟",
        options: [
          "محاولة خداع المستخدمين لسرقة معلومات حساسة عبر رسائل أو مواقع تبدو موثوقة",
          "إغراق الخادم بطلبات وهمية لتعطيل خدماته بالكامل",
          "تشفير ملفات الضحية وطلب فدية مالية لفك التشفير",
          "حقن أكواد خبيثة داخل قواعد البيانات"
        ],
        correctIndex: 0,
        explanation: "التصيد الاحتيالي (Phishing) هو أسلوب هندسة اجتماعية يعتمد على إرسال رسائل أو روابط وهمية تحاكي جهات رسمية لخداع المستخدم والحصول على بياناته السرية."
      },
      {
        id: "sec_2",
        question: "ما هو الفرق الرئيسي بين التشفير المتماثل (Symmetric) وغير المتماثل (Asymmetric)؟",
        options: [
          "المتماثل يستخدم نفس المفتاح للتشفير وفك التشفير، بينما غير المتماثل يستخدم زوجاً من المفاتيح (عام وخاص)",
          "التشفير غير المتماثل لا يحتاج إلى مفاتيح على الإطلاق",
          "التشفير المتماثل يعمل فقط مع النصوص القصيرة",
          "التشفير غير المتماثل أسرع بآلاف المرات من المتماثل"
        ],
        correctIndex: 0,
        explanation: "التشفير المتماثل يعتمد على مفتاح سري مشترك واحد، في حين يستخدم التشفير غير المتماثل (مثل RSA) مفتاحاً عاماً للتشفير ومفتاحاً خاصاً لفك التشفير."
      },
      {
        id: "sec_3",
        question: "ما هي الهجمة المعروفة باسم DDoS (Distributed Denial of Service)؟",
        options: [
          "سرقة قواعد البيانات من خلال حقن أوامر SQL",
          "هجوم حجب الخدمة الموزع عبر إغراق الهدف بحركة مرور هائلة من أجهزة متعددة ومخترقة",
          "تعديل سجلات الـ DNS لتوجيه المستخدم لموقع احتيالي",
          "اعتراض الاتصال بين العميل والخادم (Man-in-the-Middle)"
        ],
        correctIndex: 1,
        explanation: "هجمات DDoS تهدف إلى تعطيل الموقع أو الخادم وجعله غير متاح للمستخدمين الشرعيين عن طريق إغراقه بسيل من البيانات والطلبات عبر شبكة Botnet."
      },
      {
        id: "sec_4",
        question: "ما فائدة المصادقة متعددة العوامل (Multi-Factor Authentication - MFA)؟",
        options: [
          "تسرع عملية تسجيل الدخول بنقرة واحدة",
          "تضيف طبقات أمان إضافية مثل رمز الهاتف أو البصمة بجانب كلمة المرور لتقليل خطر الاختراق",
          "تقوم بتشفير اتصال الإنترنت تلقائياً",
          "تمنع الفيروسات من الدخول إلى جهاز الكمبيوتر"
        ],
        correctIndex: 1,
        explanation: "تقنية MFA تتطلب من المستخدم تقديم عاملين أو أكثر لإثبات الهوية (ما تعرفه كالرمز، وما تملكه كالهاتف، وما أنت عليه كالبصمة) مما يعزز الحماية بشكل كبير."
      },
      {
        id: "sec_5",
        question: "أي من بروتوكولات نقل النصوص التالية يوفر اتصالاً مشفراً وآمناً باستخدام SSL/TLS؟",
        options: [
          "HTTP",
          "FTP",
          "HTTPS",
          "Telnet"
        ],
        correctIndex: 2,
        explanation: "بروتوكول HTTPS (Hypertext Transfer Protocol Secure) يضمن تشفير البيانات المتبادلة بين المتصفح والخادم وحمايتها من التنصت والتلاعب."
      }
    ],

    // 5. اللغة الإنجليزية (English Language)
    english: [
      {
        id: "eng_1",
        question: "Choose the correct sentence that uses the Present Perfect Continuous tense properly:",
        options: [
          "She has been studying English for three hours.",
          "She had studied English yesterday morning.",
          "She is study English since two years.",
          "She has study English for three hours."
        ],
        correctIndex: 0,
        explanation: "The Present Perfect Continuous structure is: Subject + has/have + been + verb-ing. Option 1 is grammatically perfect and natural."
      },
      {
        id: "eng_2",
        question: "What is the closest synonym for the word 'Meticulous'?",
        options: [
          "Careless",
          "Extremely careful and precise",
          "Hasty and impatient",
          "Generous"
        ],
        correctIndex: 1,
        explanation: "'Meticulous' means showing great attention to detail; very careful and precise in one's work."
      },
      {
        id: "eng_3",
        question: "Which conditional type expresses an impossible or hypothetical situation in the past? (e.g., If I had studied...)",
        options: [
          "Zero Conditional",
          "First Conditional",
          "Second Conditional",
          "Third Conditional"
        ],
        correctIndex: 3,
        explanation: "Third Conditional (If + Past Perfect, would have + past participle) expresses regrets or hypothetical conditions about past events that cannot be changed."
      },
      {
        id: "eng_4",
        question: "Identify the figure of speech in: 'The wind whispered softly through the dark trees.'",
        options: [
          "Metaphor",
          "Personification (التشخيص)",
          "Hyperbole",
          "Simile"
        ],
        correctIndex: 1,
        explanation: "Personification gives human qualities or actions (whispering) to non-human elements (the wind)."
      },
      {
        id: "eng_5",
        question: "Select the sentence with the correct subject-verb agreement:",
        options: [
          "Neither the teacher nor the students was ready for the exam.",
          "Each of the participants has received a certificate.",
          "Every one of the books are on the shelf.",
          "The group of engineers were arriving late."
        ],
        correctIndex: 1,
        explanation: "'Each' is a singular pronoun and correctly takes the singular verb 'has received'."
      }
    ],

    // 6. اللغة العربية (Arabic Language)
    arabic: [
      {
        id: "arb_1",
        question: "ما هو إعراب كلمة 'طالباً' في الجملة: 'كافأ المعلمُ عشرينَ طالباً متفوقاً'؟",
        options: [
          "مفعول به ثانٍ منصوب",
          "تمييز منصوب وعلامة نصبه الفتحة",
          "حال منصوبة وعلامة نصبها الفتحة",
          "مضاف إليه مجرور"
        ],
        correctIndex: 1,
        explanation: "الاسم النكرة المنصوب الواقع بعد ألفاظ العقود (من 20 إلى 90) يعرب دائماً تمييزاً مفرداً منصوباً."
      },
      {
        id: "arb_2",
        question: "أي من الأفعال التالية يعد فعلاً معتلاً من نوع 'المثال'؟",
        options: [
          "وَعدَ (أوله حرف علة)",
          "قالَ (وسطه حرف علة)",
          "دَعا (آخره حرف علة)",
          "وَقى (أوله وآخره حرف علة)"
        ],
        correctIndex: 0,
        explanation: "الفعل المعتل 'المثال' هو ما كان حرفه الأصلي الأول حرف علة مثل: وَعَدَ، وَجَدَ، يَئِسَ."
      },
      {
        id: "arb_3",
        question: "ما هو نوع المشتق للكلمة 'مُستَخرَج' في جملة: 'البترولُ مُستَخرَجٌ من باطن الأرض'؟",
        options: [
          "اسم فاعل",
          "اسم مفعول لفعل غير ثلاثي",
          "اسم مكان",
          "صيغة مبالغة"
        ],
        correctIndex: 1,
        explanation: "صيغ بضم أوله وفتح ما قبل آخره ويدل على ما وقع عليه الفعل، فهو اسم مفعول من الفعل غير الثلاثي (استخرج)."
      },
      {
        id: "arb_4",
        question: "ما هو المحسن البديعي في قوله تعالى: ﴿وَيَوْمَ تَقُومُ السَّاعَةُ يُقْسِمُ الْمُجْرِمُونَ مَا لَبِثُوا غَيْرَ سَاعَةٍ﴾؟",
        options: [
          "جناس تام",
          "طباق إيجاب",
          "سجع مرصع",
          "مقابلة"
        ],
        correctIndex: 0,
        explanation: "جناس تام لاتفاق اللفظين (الساعة - ساعة) في نوع الحروف وحركاتها وعددها وترتيبها مع اختلاف المعنى (يوم القيامة / ساعة من الزمن)."
      },
      {
        id: "arb_5",
        question: "ما هو الضبط الصحيح للممنوع من الصرف 'مساجدَ' في جملة: 'صليتُ في مساجدَ أثريةٍ'؟",
        options: [
          "مجرور بالفتحة نيابة عن الكسرة لأنه نكرة ممنوع من الصرف على صيغة منتهى الجموع",
          "مجرور بالكسرة لأنه مسبوق بحرف جر",
          "مرفوع بالضمة",
          "منصوب بالفتحة لأنه مفعول فيه"
        ],
        correctIndex: 0,
        explanation: "الممنوع من الصرف يُجر بالفتحة نيابة عن الكسرة ما لم يُعرّف بـ 'أل' أو يُضف، وهو هنا صيغة منتهى الجموع غير مضاف ولا معرف."
      }
    ]
  },

  // Helper storage management
  getUsers() {
    try {
      const users = localStorage.getItem("skill_arena_users");
      const defaultList = [
        {
          id: "u_1",
          name: "أحمد علي",
          email: "example@gmail.com",
          password: "password",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          title: "طالب متميز",
          joinedDate: "2026-01-15"
        }
      ];
      if (!users) {
        return defaultList;
      }
      const parsed = JSON.parse(users);
      // Ensure example@gmail.com exists
      if (!parsed.some(u => u.email.toLowerCase() === "example@gmail.com")) {
        parsed.push(defaultList[0]);
      }
      return parsed;
    } catch (e) {
      return [];
    }
  },

  saveUsers(users) {
    localStorage.setItem("skill_arena_users", JSON.stringify(users));
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem("skill_arena_current_user");
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem("skill_arena_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("skill_arena_current_user");
    }
  },

  getQuizHistory() {
    try {
      const history = localStorage.getItem("skill_arena_history");
      return history ? JSON.parse(history) : [];
    } catch (e) {
      return [];
    }
  },

  saveQuizResult(result) {
    const history = this.getQuizHistory();
    history.unshift(result);
    localStorage.setItem("skill_arena_history", JSON.stringify(history));
  },

  getSubjectById(subjectId) {
    for (const cat of this.categories) {
      const sub = cat.subjects.find(s => s.id === subjectId);
      if (sub) return { ...sub, categoryTitle: cat.title };
    }
    return null;
  },

  getQuestionsBySubject(subjectId) {
    return this.questions[subjectId] || [];
  }
};
