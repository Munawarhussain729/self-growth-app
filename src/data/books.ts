import type { BookSummary, GrowthGoal } from "../types";

export const books: BookSummary[] = [
	{
		id: "atomic-habits",
		title: "Atomic Habits",
		author: "James Clear",
		year: "2018",
		goals: ["Discipline", "Productivity", "Health habits", "Focus"],
		bestFor: "Building tiny routines that compound over time.",
		reference: "Clear, James. Atomic Habits. Avery, 2018.",
		summary: [
			"This original summary focuses on the book's high-level habit framework without copying its protected wording. The central lesson is that personal change becomes easier when you stop relying only on motivation and start shaping the systems around your behavior.",
			"The book presents habits as a loop of cue, craving, response, and reward. In practical terms, that means a habit is easier to build when it is visible, attractive, simple, and satisfying. A habit is easier to break when it becomes hidden, unattractive, difficult, and unrewarding.",
			"A useful takeaway for your app is to connect identity with action. Instead of asking only, 'What result do I want?' ask, 'What kind of person would naturally do this?' Then choose one small behavior that casts a vote for that identity today.",
			"For self-growth, the book is especially strong because it makes improvement feel less dramatic and more repeatable. You do not need a complete life overhaul; you need a reliable cue, a tiny starting point, and a way to make completion feel rewarding.",
			"The deeper lesson is that habits are not isolated tasks. They are part of a personal system: your environment, your self-image, your energy, your friends, your reminders, and the friction around each behavior. Change the system and discipline becomes less dependent on mood.",
		],
		keyIdeas: [
			"Small habits become powerful through repetition, not intensity.",
			"Environment design reduces the amount of willpower required.",
			"Identity-based habits make behavior feel connected to who you are becoming.",
		],
		actionSteps: [
			"Choose one habit and make the first step take less than two minutes.",
			"Put the cue for that habit somewhere visible.",
			"Track only whether you showed up today, not whether it was perfect.",
		],
		reflectionPrompt:
			"What tiny action would prove today that I am becoming more disciplined?",
	},
	{
		id: "deep-work",
		title: "Deep Work",
		author: "Cal Newport",
		year: "2016",
		goals: ["Focus", "Productivity", "Discipline"],
		bestFor: "Training your attention and protecting serious thinking time.",
		reference: "Newport, Cal. Deep Work. Grand Central Publishing, 2016.",
		summary: [
			"This original summary captures the book's main productivity argument: meaningful work needs protected attention. In a distracted environment, the ability to focus deeply becomes both rare and valuable.",
			"The book separates deep work from shallow work. Deep work creates new value and improves skill; shallow work keeps things moving but often fragments your mind. The practical challenge is not to eliminate all shallow tasks, but to stop letting them dominate your best hours.",
			"For personal growth, the lesson is clear: your attention needs boundaries. Schedule focused blocks, reduce easy interruptions, and decide in advance what a successful session looks like.",
			"The book is also about respect for your own mind. If your best thinking is constantly interrupted, you may still feel busy, but you lose the satisfaction that comes from doing work that stretches you.",
			"A deeper application is to design rituals around focus: same place, clear duration, defined outcome, and a shutdown point. This turns concentration from a random event into a trained practice.",
		],
		keyIdeas: [
			"Focus is trainable when you create repeatable conditions for it.",
			"Distraction has a switching cost even when it feels harmless.",
			"A clear shutdown ritual protects recovery and reduces mental residue.",
		],
		actionSteps: [
			"Block one 30-minute focus session for a single task.",
			"Keep your phone out of reach during the session.",
			"Write the exact outcome you want before starting.",
		],
		reflectionPrompt:
			"What is one task that deserves my best attention instead of my leftover attention?",
	},
	{
		id: "mindset",
		title: "Mindset",
		author: "Carol S. Dweck",
		year: "2006",
		goals: ["Confidence", "Emotional control", "Spiritual growth"],
		bestFor: "Reframing failure, effort, and learning.",
		reference: "Dweck, Carol S. Mindset. Random House, 2006.",
		summary: [
			"This original summary explains the book's central distinction between fixed and growth mindsets. A fixed mindset treats ability as proof of worth; a growth mindset treats ability as something that can develop through effort, strategy, and feedback.",
			"The value of the book is not simply 'think positive.' It is learning to interpret struggle differently. Difficulty can become information instead of identity. A mistake can become guidance instead of a verdict.",
			"For your growth practice, this matters because the way you explain setbacks shapes what you do next. If failure means you are incapable, you stop. If failure means your method needs adjustment, you continue wiser.",
			"The book is useful when confidence is fragile because it shifts attention away from proving yourself and toward developing yourself. That makes feedback less threatening and effort more honorable.",
			"In daily life, a growth mindset looks like asking better questions after disappointment: What did this teach me? What strategy should I try next? Who can help me improve?",
		],
		keyIdeas: [
			"Effort is part of growth, not evidence that you lack talent.",
			"Feedback is easier to use when it is separated from self-worth.",
			"The phrase 'not yet' creates room for improvement.",
		],
		actionSteps: [
			"Write one current struggle as a skill you are developing.",
			"Ask what strategy you can change instead of what is wrong with you.",
			"Notice one moment today where effort deserves respect.",
		],
		reflectionPrompt:
			"Where am I treating a learning curve like a personal flaw?",
	},
	{
		id: "nonviolent-communication",
		title: "Nonviolent Communication",
		author: "Marshall B. Rosenberg",
		year: "1999",
		goals: ["Communication", "Emotional control", "Confidence"],
		bestFor: "Having honest conversations without blame.",
		reference:
			"Rosenberg, Marshall B. Nonviolent Communication. PuddleDancer Press, 1999.",
		summary: [
			"This original summary focuses on the book's communication model. The core idea is to express what is happening, how you feel, what you need, and what you are requesting without turning the other person into the enemy.",
			"The book is useful because many conflicts escalate when observations become judgments. Saying what you noticed is different from accusing someone of a character flaw. That difference can keep a conversation open.",
			"For self-growth, this book helps you become clearer about your needs while staying respectful of another person's humanity. It supports both courage and care.",
			"The deeper skill is translation. Instead of reacting to blame with blame, you learn to listen for the need underneath the words. That does not mean accepting bad behavior; it means responding from clarity instead of automatic defense.",
			"Practically, the book can improve journaling too. When you write about conflict, separate what happened, what you felt, what you needed, and what you might request next.",
		],
		keyIdeas: [
			"Separate observations from judgments.",
			"Feelings often point toward needs.",
			"Requests work better when they are specific and doable.",
		],
		actionSteps: [
			"Before a hard conversation, write the observation without interpretation.",
			"Name the feeling and need underneath your reaction.",
			"Make one clear request instead of a broad complaint.",
		],
		reflectionPrompt:
			"What do I need to say clearly without blaming the other person?",
	},
	{
		id: "mans-search-for-meaning",
		title: "Man's Search for Meaning",
		author: "Viktor E. Frankl",
		year: "1946",
		goals: ["Spiritual growth", "Emotional control", "Confidence"],
		bestFor: "Finding meaning during difficulty.",
		reference:
			"Frankl, Viktor E. Man's Search for Meaning. Beacon Press edition, 2006.",
		summary: [
			"This original summary reflects the book's broad theme: human beings can endure more when they are connected to meaning. Frankl's work is rooted in his experiences and his psychological approach, often called logotherapy.",
			"The book does not suggest that suffering is good. It argues that when suffering cannot be avoided, a person may still choose the attitude and responsibility they bring to it.",
			"For daily practice, the book invites you to ask what life is asking from you today. Meaning can be found in work, love, courage, service, and the way you meet unavoidable hardship.",
			"The book's power is in its seriousness. It does not treat growth as comfort or optimization only. It asks how a person can remain responsible, loving, and purposeful even when circumstances are painful.",
			"A useful practice is to stop asking only what you want from life and ask what responsibility is in front of you. That question can turn confusion into a next honorable step.",
		],
		keyIdeas: [
			"Meaning can steady a person when circumstances are painful.",
			"Responsibility is a path back to agency.",
			"Attitude can remain a choice even when conditions are limited.",
		],
		actionSteps: [
			"Name one responsibility today that feels meaningful.",
			"Write one value you want your response to express.",
			"Do one act of service, however small.",
		],
		reflectionPrompt:
			"What is life asking of me today, and how do I want to answer?",
	},
	{
		id: "the-power-of-now",
		title: "The Power of Now",
		author: "Eckhart Tolle",
		year: "1997",
		goals: ["Spiritual growth", "Emotional control", "Focus"],
		bestFor: "Practicing presence and reducing overthinking.",
		reference: "Tolle, Eckhart. The Power of Now. New World Library, 1999.",
		summary: [
			"This original summary describes the book's main invitation: notice how much suffering is intensified by living in regret, anticipation, or mental resistance rather than the present moment.",
			"The book emphasizes awareness of thoughts instead of total identification with them. You can observe worry, anger, or fear without immediately obeying it. That observing space creates freedom.",
			"For your app, this pairs well with journaling because reflection can reveal when your mind is replaying the past or rehearsing the future. The practice is to return to what is real and workable now.",
			"The book is most useful when you treat presence as a practice, not as a personality trait. A minute of noticing breath, posture, sound, and thought can interrupt a long chain of automatic stress.",
			"The deeper lesson is not to reject planning or memory, but to stop living entirely inside them. The present moment is where repair, action, forgiveness, and attention actually happen.",
		],
		keyIdeas: [
			"Presence interrupts automatic overthinking.",
			"You can observe thoughts without becoming them.",
			"The current moment is the only place action can happen.",
		],
		actionSteps: [
			"Pause for one minute and notice sounds, breath, and body sensations.",
			"Label one recurring thought as a thought, not a fact.",
			"Choose the next grounded action available now.",
		],
		reflectionPrompt:
			"Where am I living in my head instead of meeting this moment?",
	},
	{
		id: "essentialism",
		title: "Essentialism",
		author: "Greg McKeown",
		year: "2014",
		goals: ["Focus", "Productivity", "Discipline"],
		bestFor: "Choosing fewer priorities and protecting energy.",
		reference: "McKeown, Greg. Essentialism. Crown Business, 2014.",
		summary: [
			"This original summary centers on the book's main claim: a meaningful life requires deliberate tradeoffs. If everything matters equally, your time gets spent by default instead of by choice.",
			"The book encourages a disciplined pursuit of less but better. That means exploring options, eliminating the nonessential, and making execution easier for what truly matters.",
			"For personal growth, this book is a useful antidote to scattered ambition. It asks you to stop confusing busyness with progress and to choose the few commitments that deserve your best self.",
			"The book is not about doing less out of laziness. It is about protecting the work, relationships, and values that would otherwise be buried under weak yeses.",
			"A deeper takeaway is that clarity creates energy. When you know what is essential, decisions become easier, boundaries become less apologetic, and effort becomes more concentrated.",
		],
		keyIdeas: [
			"Every yes spends time, attention, and energy.",
			"Tradeoffs are not a failure; they are how priorities become real.",
			"Removing nonessential commitments creates room for excellent work.",
		],
		actionSteps: [
			"List three current commitments and mark one as nonessential.",
			"Say no or delay one low-value request this week.",
			"Choose one priority that deserves protected time.",
		],
		reflectionPrompt:
			"What am I saying yes to that quietly steals from what matters most?",
	},
	{
		id: "the-7-habits",
		title: "The 7 Habits of Highly Effective People",
		author: "Stephen R. Covey",
		year: "1989",
		goals: ["Discipline", "Communication", "Productivity", "Spiritual growth"],
		bestFor:
			"Principle-centered growth across work, relationships, and character.",
		reference:
			"Covey, Stephen R. The 7 Habits of Highly Effective People. Free Press, 1989.",
		summary: [
			"This original summary captures the book's broad framework for effectiveness: growth begins with character, responsibility, and clarity about what matters. The book moves from personal habits to relational habits and renewal.",
			"A major lesson is to focus on what you can influence. Complaining about what you cannot control weakens agency; acting within your circle of influence builds it.",
			"The book also emphasizes beginning with the end in mind. In personal terms, that means making today's decisions with your values and long-term identity in view.",
			"The relational side matters too. Effectiveness is not only personal productivity; it includes trust, listening, mutual benefit, and the ability to understand before trying to be understood.",
			"As a self-growth guide, the book works best when you translate each habit into one weekly behavior. Otherwise it can feel broad; with practice, it becomes a steady framework for character and relationships.",
		],
		keyIdeas: [
			"Responsibility starts with choosing your response.",
			"Clear values help daily choices align with the person you want to become.",
			"Strong relationships require both courage and consideration.",
		],
		actionSteps: [
			"Write one value you want to live today.",
			"Identify one situation where you can choose your response.",
			"Make one relationship deposit through listening, appreciation, or reliability.",
		],
		reflectionPrompt:
			"What choice today would align with the person I want to become?",
	},
];

export function recommendedBooks(goals: GrowthGoal[]) {
	if (!goals.length) return books;
	return [...books].sort(
		(first, second) => scoreBook(second, goals) - scoreBook(first, goals),
	);
}

export function scoreBook(book: BookSummary, goals: GrowthGoal[]) {
	return book.goals.filter((goal) => goals.includes(goal)).length;
}
