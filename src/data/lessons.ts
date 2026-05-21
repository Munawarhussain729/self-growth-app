import { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "small-promises",
    title: "Keep One Small Promise",
    theme: "Discipline",
    body: [
      "Discipline becomes easier when it starts with trust. Every time you keep a small promise to yourself, your brain collects evidence that your word means something.",
      "The promise should be almost too small to resist: ten minutes of reading, one tidy surface, one honest message, one walk around the block. The size matters less than the follow-through.",
      "Growth often feels dramatic in hindsight, but it is usually built from quiet repetitions that no one else sees."
    ],
    keyIdea: "Self-trust grows when your promises are small enough to keep and clear enough to measure.",
    actionStep: "Choose one promise for today that takes less than ten minutes, then write down when you will do it."
  },
  {
    id: "attention-budget",
    title: "Protect Your Attention",
    theme: "Focus",
    body: [
      "Attention is not just a productivity tool. It is the material your life is made from. What you repeatedly attend to becomes what your mind treats as important.",
      "A focused day is rarely a perfect day. It is a day where you notice distraction faster and return more gently. That return is the real skill.",
      "Design helps more than willpower. Put the right task closer, put the noisy thing farther away, and make the next useful step obvious."
    ],
    keyIdea: "Focus improves when your environment asks less heroic effort from you.",
    actionStep: "Move one distraction out of reach for the next 60 minutes and put one meaningful task in front of you."
  },
  {
    id: "confidence-evidence",
    title: "Confidence Needs Evidence",
    theme: "Confidence",
    body: [
      "Confidence is not pretending you are never afraid. It is having enough evidence that you can act while afraid and still remain intact.",
      "You gather that evidence through small acts of courage. Speaking clearly, starting imperfectly, asking the question, finishing the thing.",
      "The goal is not to feel ready all the time. The goal is to become familiar with moving before readiness fully arrives."
    ],
    keyIdea: "Confidence follows repeated proof that you can handle discomfort.",
    actionStep: "Do one useful thing today before you feel fully ready."
  },
  {
    id: "pause-space",
    title: "Create a Pause",
    theme: "Emotional control",
    body: [
      "Emotional control does not mean becoming less emotional. It means creating a little space between the first feeling and the next action.",
      "A pause gives your wiser self time to arrive. One breath, one glass of water, one sentence written before it is spoken can change the whole direction of a moment.",
      "You do not need to win every inner storm. You only need to practice not handing it the steering wheel immediately."
    ],
    keyIdea: "The pause is where choice returns.",
    actionStep: "When you feel reactive today, take three slow breaths before responding."
  },
  {
    id: "clear-kind",
    title: "Be Clear and Kind",
    theme: "Communication",
    body: [
      "Good communication is not a choice between honesty and kindness. The strongest conversations usually need both.",
      "Clarity without kindness can feel like attack. Kindness without clarity can become avoidance. Together, they make truth easier to receive.",
      "Before an important conversation, decide what you actually mean. Then say it in language that leaves the other person their dignity."
    ],
    keyIdea: "Clarity carries the message; kindness keeps the bridge intact.",
    actionStep: "Write one sentence today that says what you mean without blaming anyone."
  },
  {
    id: "next-action",
    title: "Find the Next Action",
    theme: "Productivity",
    body: [
      "A task feels heavy when it is actually a cloud of unclear decisions. Productivity often begins by turning the cloud into one physical next action.",
      "Do not ask, 'How do I finish everything?' Ask, 'What can I do in the next ten minutes that would move this forward?'",
      "Momentum is easier to create than motivation. Once your body starts, your mind often catches up."
    ],
    keyIdea: "Vague goals drain energy; clear next actions create movement.",
    actionStep: "Pick one stuck task and define the next visible action in one sentence."
  },
  {
    id: "body-vote",
    title: "Let Your Body Vote",
    theme: "Health habits",
    body: [
      "Your body votes on your future every day through sleep, food, movement, and recovery. None of these need to be perfect to matter.",
      "A healthy habit becomes sustainable when it feels like care rather than punishment. Start with something your future self will thank you for, not something your current self will resent.",
      "Small physical wins often spill into mental clarity. A short walk can become a better decision. Water can become patience."
    ],
    keyIdea: "Health habits work best when they feel like support, not self-criticism.",
    actionStep: "Choose one caring action for your body today: water, movement, sunlight, or sleep."
  },
  {
    id: "quiet-checkin",
    title: "Make Room for Meaning",
    theme: "Spiritual growth",
    body: [
      "Spiritual growth can begin with a simple question: what kind of person am I practicing becoming?",
      "Silence, prayer, gratitude, reflection, or service can all make life feel less automatic. The shape matters less than the sincerity.",
      "A meaningful life is not only built by achieving more. It is built by remembering what deserves your loyalty."
    ],
    keyIdea: "Meaning grows when you return to what matters before the day pulls you away.",
    actionStep: "Spend five quiet minutes naming what you want your actions to serve today."
  }
];

export function lessonForDate(date = new Date()) {
  const dayNumber = Math.floor(date.getTime() / 86400000);
  return lessons[dayNumber % lessons.length];
}
