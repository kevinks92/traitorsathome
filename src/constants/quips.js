const HOST_QUIPS = {
lobby: [
"Welcome to the castle, you gorgeous, gullible little lambs. Some of you are wolves. The rest of you are dinner. Isn't that fun?",
"Look around. Smile at your friends. Now remember this moment — because at least one person in this room is already planning to absolutely destroy you. Cheers!",
"You all arrived with your little overnight bags and your little trusting faces and I am OBSESSED with how wrong this is about to go for most of you.",
"The castle welcomes you! The Traitors are already clocking your weaknesses. The Faithful are blissfully unaware. And I am having the time of my life.",
"Some of you will lie. Some of you will cry. Some of you will do both simultaneously and it will be genuinely beautiful. Let's begin.",
],
role_reveal: [
"Check your phone. Quietly. If you gasp, scream, or make any sound whatsoever — congratulations, you've already lost.",
"Your destiny has been decided and it is NOT up for debate. Some of you got Faithful. Bless your sweet, doomed little hearts.",
"Read it. Absorb it. Bury it so deep inside yourself that it dies. The person to your left is watching your face RIGHT now.",
"Whatever you just read — that is your secret, your cross, and potentially your coffin. Welcome to the worst slumber party ever.",
"Somewhere in this room, a Traitor just had to physically stop themselves from smiling. Can you spot them? No? Exactly.",
],
mission_briefing: [
"Shields, daggers, and mysterious powers are on the line — which sounds like a Renaissance Fair but is actually much more dangerous.",
"Time to compete! Badly, in some cases. Suspiciously, in others. The Traitors among you are already deciding whether to win or to let someone else look impressive.",
"A mission! How fun! How pointless for the person who's about to get murdered tonight! Play your heart out anyway.",
"There are shields at stake, darlings. A shield means you survive the night. So yes — this matters. Try to look like it doesn't.",
"Here's your little task. Some of you will excel. Some of you will flounder. One of you is actively trying to lose on purpose. Fascinating.",
],
mission_active: [
"The mission is live. Eyes on your opponents. Smile with your whole face. Mean none of it.",
"Compete! Sabotage subtly! Win suspiciously or lose strategically! The floor is yours, you deranged little game-players.",
"Note to Traitors: appearing to try very hard and failing is called 'theatre.' Appearing to try very hard and winning is called 'a red flag.' Choose wisely.",
"Whatever you're doing right now — someone is reading your body language like a cheap paperback. Just so you know.",
],
free_roam: [
"The castle is YOURS. Go. Scatter. Find the person you're most suspicious of and tell them you completely trust them. That's called strategy.",
"This is where the real game happens — in hushed tones on the patio, in loaded eye contact over the kitchen counter, in whispers on the stairs that you absolutely didn't think anyone else could hear.",
"You have 12 minutes to scheme, bond, deflect, charm, and lie through your teeth. Make them count.",
"Roam freely. Corner someone. Tell them a secret — real or invented. Alliances formed in this phase have historically been both beautiful and completely useless.",
"The Traitors have something to discuss. The Faithful have someone to suspect. And at least one person is in the patio absolutely spiralling. Off you go.",
],
round_table: [
"Welcome to the Round Table — where trust comes to die and paranoia gets a seat right next to the charcuterie board.",
"Someone in this room is lying. Multiple people, actually. The challenge is figuring out which lies are CUTE and which are CRIMINAL.",
"Time to perform, darlings. Look innocent. Sound credible. Point the finger at someone else with absolute conviction. The guilty among you have been preparing for this their entire lives.",
"The floor is open. Accuse with style. Defend with flair. Cry if you need to — it's actually quite effective and I respect the commitment.",
"This is your chance to unmask a Traitor. It's also a Traitor's chance to unmask a Faithful and watch everyone lose their minds. Place your bets.",
],
voting: [
"Phones out. Votes in. No conferring, no changing your mind, no 'but wait—'. Just pure, unfiltered, privately committed betrayal.",
"The time for talking is over and honestly thank god because some of you were not helping yourselves. Vote now. Vote with your gut. Vote with your grudge.",
"Someone's name is about to appear on a lot of screens. They may deserve it. They may be completely innocent. Either way — they're going home.",
"Cast your vote like no one's watching. Because no one is. That's the beauty and the horror of private ballots.",
"You have one vote. One chance. One opportunity to either save this group or catastrophically misread the room. Choose.",
],
night_sequester: [
"Blindfolds on. Everyone stays exactly where they are. The Traitors will be tapped on the shoulder — they remove their blindfolds, do what needs to be done, then blindfolds back on. Everyone else: stay still and stay quiet.",
"Eyes closed, blindfolds on. Nobody moves. Nobody leaves. The Traitors will get a tap when it's their turn. Everyone else — sit tight, it'll be 5 minutes.",
"Heads down, blindfolds on. You're all in the same room. The Traitors know what's coming. Everyone else: patience.",
"Blindfolds on. Stay seated. The Traitors are tapped to open their eyes — the Faithful are not. Sit still and wait for morning.",
"Everybody down. Blindfolds on. Nobody moves until I say so. This should take about 5 minutes. Try not to fall asleep — actually, go ahead, it won't help you.",
],
night_traitor_chat: [
"The Turret is open. Choose your target. Be decisive — the Faithful are sitting blindfolded out there and patience has limits.",
"Welcome to the Turret. Pick a victim. Be specific and be quick. Every second you debate is another second someone sits on a floor with a blindfold on.",
"Now's the time. Who goes? Chat, vote, and wrap it up. The Faithful are waiting and they are not comfortable.",
"The best Traitors are decisive. Pick your target, cast your votes, and get it done. Drama later. Speed now.",
"Pick your target. Make it unanimous if you can. You've got 5 minutes. Use them.",
],
breakfast: [
"Good MORNING, castle guests! Some of you are about to walk into a room and notice something very, very wrong with the seating arrangement.",
"Breakfast is served. Eggs, coffee, and the dawning realisation that someone you were talking to last night is no longer here. Bon appétit.",
"The morning reveals all. Specifically: who made it through the night and who did not. Come to the table. Count the chairs. Do the maths.",
"Rise and shine! If you're reading this, you survived. For now. Shuffle to breakfast and try not to visibly react when you realise who's missing.",
"Nothing says 'good morning' like an empty chair at the breakfast table. Come in. Sit down. And act surprised — whether or not you already knew.",
],
};

const getQuip = (phase) => {
const quips = HOST_QUIPS[phase] || ["And so the game continues…"];
return quips[Math.floor(Math.random() * quips.length)];
};

export { HOST_QUIPS, getQuip };
