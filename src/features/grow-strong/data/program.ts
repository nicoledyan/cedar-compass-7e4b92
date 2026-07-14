import type { Exercise, WorkoutDay, WorkoutType } from '../types';

export const phases = [
  { name: 'Foundation', weeks: 'Weeks 1-4', focus: 'Consistency, form, low soreness.' },
  { name: 'Consistency', weeks: 'Weeks 5-8', focus: 'More reps, smoother movement, habit building.' },
  { name: 'Build', weeks: 'Weeks 9-12', focus: 'Slightly harder variations and more volume.' },
  { name: 'Strength', weeks: 'Weeks 13-16', focus: 'Tempo, unilateral work, stronger core.' },
  { name: 'Definition', weeks: 'Weeks 17-20', focus: 'Density, controlled circuits, visible muscle tone.' },
  { name: 'Confidence', weeks: 'Weeks 21-24', focus: 'Strongest pain-free variations and consistency.' }
];

export const milestones = [
  { week: 1, label: 'Planted Roots' },
  { week: 4, label: 'Showing Up' },
  { week: 8, label: 'Momentum' },
  { week: 12, label: 'Stronger Than You Think' },
  { week: 16, label: 'Built Different' },
  { week: 20, label: 'Visible Strength' },
  { week: 24, label: 'Grow Strong' }
];

export const elbowRules = [
  '0-2: continue if movement feels stable.',
  '3-4: regress or swap upper-body movement.',
  '5+: stop upper-body loading for the day.',
  'Sharp pain, tingling, weakness, or next-day pain: mark it and regress next session.'
];

export const nutritionGuide = {
  protein: '110-130g/day',
  calories: '1700-1900/day to start, then adjust from real trend data.',
  formulas: [
    'Protein + colorful produce + satisfying carb + olive oil, avocado, nuts, or dairy.',
    'Greek yogurt bowl: yogurt, berries, granola, chia, and a little honey.',
    'Plate dinner: chicken, tofu, fish, eggs, or beans with potatoes, rice, or sourdough and a big salad.',
    'No-cook lunch: turkey or hummus wrap, fruit, crunchy vegetables, and cottage cheese.'
  ],
  groceries: [
    'Greek yogurt',
    'Eggs',
    'Chicken or tofu',
    'Salmon or tuna packets',
    'Cottage cheese',
    'Beans and lentils',
    'Frozen berries',
    'Spinach and salad greens',
    'Rice, potatoes, oats, sourdough',
    'Avocado, olive oil, nuts'
  ],
  snacks: [
    'Cottage cheese and fruit',
    'Protein smoothie',
    'Hard-boiled eggs and crackers',
    'Greek yogurt with cinnamon',
    'Apple with peanut butter',
    'Tuna packet with cucumber slices'
  ],
  restaurants: [
    'Choose a clear protein first, then add a carb you actually want.',
    'Ask for sauces on the side when portions are mysterious.',
    'Split fries if you want them. Do not turn dinner into a courtroom.',
    'Aim for enough protein and move on with your life.'
  ]
};

export const exercises: Exercise[] = [
  {
    id: 'chair-squat',
    name: 'Chair squat',
    category: 'Lower body',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Stand in front of a chair, sit back until your hips touch, then stand tall with control.',
    formCues: ['Feet rooted', 'Knees follow toes', 'Chest relaxed but lifted'],
    commonMistakes: ['Dropping onto the chair', 'Knees collapsing inward'],
    easier: 'Use a higher chair or hold a counter lightly.',
    harder: 'Pause for one second at the chair.',
    substitute: 'Wall sit'
  },
  {
    id: 'bodyweight-squat',
    name: 'Bodyweight squat',
    category: 'Lower body',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Sit hips back and down, then press through the full foot to stand.',
    formCues: ['Ribs stacked over pelvis', 'Full-foot pressure', 'Smooth tempo'],
    commonMistakes: ['Rushing reps', 'Heels lifting'],
    easier: 'Return to chair squats.',
    harder: 'Tempo squat',
    substitute: 'Step-up'
  },
  {
    id: 'tempo-squat',
    name: 'Tempo squat',
    category: 'Lower body',
    difficulty: 'Medium',
    elbowLoad: 'None',
    howTo: 'Lower for three slow counts, pause briefly at the bottom, then stand with control.',
    formCues: ['Slow lower', 'Quiet knees', 'Stand without bouncing'],
    commonMistakes: ['Turning the pause into a collapse', 'Holding breath'],
    easier: 'Bodyweight squat',
    harder: 'Add a longer pause.',
    substitute: 'Wall sit'
  },
  {
    id: 'reverse-lunge',
    name: 'Reverse lunge',
    category: 'Lower body',
    difficulty: 'Medium',
    elbowLoad: 'None',
    howTo: 'Step one foot back, lower gently, then push through the front foot to return.',
    formCues: ['Short comfortable range', 'Front knee tracks toes', 'Tall posture'],
    commonMistakes: ['Taking too long a step', 'Pushing off the back foot too much'],
    easier: 'Split squat hold near a wall.',
    harder: 'Add a slow lowering tempo.',
    substitute: 'Step-up'
  },
  {
    id: 'step-up',
    name: 'Step-up',
    category: 'Lower body',
    difficulty: 'Medium',
    elbowLoad: 'None',
    howTo: 'Step onto a sturdy low surface, stand fully, then lower with control.',
    formCues: ['Drive through front heel', 'Control the way down', 'Use a low step'],
    commonMistakes: ['Springing off the back leg', 'Letting the knee cave'],
    easier: 'Use a lower step.',
    harder: 'Slow the lowering phase.',
    substitute: 'Reverse lunge'
  },
  {
    id: 'wall-sit',
    name: 'Wall sit',
    category: 'Lower body',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Lean against a wall and slide down into a comfortable squat hold.',
    formCues: ['Knees over ankles', 'Back supported', 'Breathe steadily'],
    commonMistakes: ['Going too low too soon', 'Holding breath'],
    easier: 'Hold higher on the wall.',
    harder: 'Add five to ten seconds.',
    substitute: 'Chair squat'
  },
  {
    id: 'calf-raise',
    name: 'Calf raise',
    category: 'Lower body',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Rise onto the balls of your feet, pause, then lower slowly.',
    formCues: ['Tall posture', 'Even pressure', 'Slow lower'],
    commonMistakes: ['Rolling ankles outward', 'Bouncing'],
    easier: 'Hold a wall lightly.',
    harder: 'Single-leg calf raise.',
    substitute: 'March in place'
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian deadlift',
    category: 'Lower body',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Hinge at the hips with soft knees, then squeeze glutes to stand.',
    formCues: ['Hips back', 'Long spine', 'Shins mostly vertical'],
    commonMistakes: ['Squatting instead of hinging', 'Rounding the back'],
    easier: 'Practice with hands on hips.',
    harder: 'Kickstand hip hinge',
    substitute: 'Glute bridge'
  },
  {
    id: 'kickstand-rdl',
    name: 'Kickstand hip hinge',
    category: 'Lower body',
    difficulty: 'Medium',
    elbowLoad: 'Low',
    howTo: 'Set one foot slightly back like a kickstand and hinge mostly into the front leg.',
    formCues: ['Front leg does the work', 'Hips stay square', 'Small range is fine'],
    commonMistakes: ['Twisting open', 'Reaching for the floor'],
    easier: 'Romanian deadlift',
    harder: 'Slow three-count lower.',
    substitute: 'Marching glute bridge'
  },
  {
    id: 'glute-bridge',
    name: 'Glute bridge',
    category: 'Lower body',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Lie on your back with knees bent, press feet down, and lift hips.',
    formCues: ['Ribs down', 'Squeeze glutes at the top', 'Do not arch low back'],
    commonMistakes: ['Pushing through toes', 'Overarching'],
    easier: 'Smaller range.',
    harder: 'Marching glute bridge',
    substitute: 'Wall sit'
  },
  {
    id: 'marching-glute-bridge',
    name: 'Marching glute bridge',
    category: 'Lower body',
    difficulty: 'Medium',
    elbowLoad: 'None',
    howTo: 'Hold a bridge and slowly lift one foot at a time without rocking.',
    formCues: ['Level hips', 'Slow marches', 'Quiet ribs'],
    commonMistakes: ['Dropping hips', 'Moving too fast'],
    easier: 'Glute bridge',
    harder: 'Single-leg glute bridge',
    substitute: 'Kickstand hip hinge'
  },
  {
    id: 'single-leg-glute-bridge',
    name: 'Single-leg glute bridge',
    category: 'Lower body',
    difficulty: 'Harder',
    elbowLoad: 'None',
    howTo: 'Bridge with one foot planted and the other leg lifted, keeping hips level.',
    formCues: ['Short range is fine', 'Level pelvis', 'Glute drives the lift'],
    commonMistakes: ['Cramping hamstrings', 'Arching low back'],
    easier: 'Marching glute bridge',
    harder: 'Add a pause at the top.',
    substitute: 'Tempo squat'
  },
  {
    id: 'wall-push-up',
    name: 'Wall push-up',
    category: 'Upper body',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Place hands on a wall at chest height, lower chest toward the wall, then press away smoothly.',
    formCues: ['Hands below shoulders', 'Elbows soft', 'Body moves as one piece'],
    commonMistakes: ['Flaring elbows wide', 'Dropping head forward'],
    easier: 'Stand closer to the wall.',
    harder: 'High counter push-up',
    substitute: 'Isometric wall press'
  },
  {
    id: 'counter-push-up',
    name: 'Counter push-up',
    category: 'Upper body',
    difficulty: 'Beginner',
    elbowLoad: 'Medium',
    howTo: 'Use a sturdy counter and perform push-ups with a long body line from head to heels.',
    formCues: ['Wrists comfortable', 'Elbows at a gentle 45-degree angle', 'Slow reps'],
    commonMistakes: ['Shrugging shoulders', 'Locking elbows at the top'],
    easier: 'Wall push-up',
    harder: 'Incline push-up',
    substitute: 'Standing shoulder raises'
  },
  {
    id: 'incline-push-up',
    name: 'Incline push-up',
    category: 'Upper body',
    difficulty: 'Medium',
    elbowLoad: 'Avoid if sore',
    howTo: 'Use a bench or sturdy elevated surface and lower with control. Stop before any elbow pain.',
    formCues: ['Strong plank line', 'Quiet shoulders', 'Stop before pain'],
    commonMistakes: ['Going too low too soon', 'Pushing through elbow pain'],
    easier: 'Counter push-up',
    harder: 'Knee push-up only if pain-free.',
    substitute: 'Isometric wall press'
  },
  {
    id: 'backpack-row',
    name: 'Backpack row',
    category: 'Upper body',
    difficulty: 'Medium',
    elbowLoad: 'Avoid if sore',
    howTo: 'Hold a lightly loaded backpack, hinge forward at the hips, and row it toward your lower ribs.',
    formCues: ['Shoulder blade moves first', 'Neutral wrist', 'Keep load light'],
    commonMistakes: ['Yanking with the arm', 'Too much weight'],
    easier: 'Standing shoulder raises',
    harder: 'Add reps before adding weight.',
    substitute: 'Scapular wall slide'
  },
  {
    id: 'standing-ytw',
    name: 'Standing shoulder raises',
    category: 'Upper body',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Stand tall and move arms through Y, T, and W shapes with slow, controlled movement.',
    formCues: ['Shoulders down away from ears', 'Small comfortable range', 'Thumbs slightly back'],
    commonMistakes: ['Arching ribs', 'Forcing range'],
    easier: 'Do one shape at a time.',
    harder: 'Pause each shape for one breath.',
    substitute: 'Scapular wall slide'
  },
  {
    id: 'scapular-wall-slide',
    name: 'Scapular wall slide',
    category: 'Upper body',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Stand with forearms against a wall and slide them overhead while keeping shoulders calm and ribs down.',
    formCues: ['Gentle pressure into wall', 'Slow slide', 'No pinching or pain'],
    commonMistakes: ['Forcing arms flat', 'Shrugging'],
    easier: 'Reduce range.',
    harder: 'Add a two-second pause overhead.',
    substitute: 'Standing shoulder raises'
  },
  {
    id: 'isometric-wall-press',
    name: 'Isometric wall press',
    category: 'Upper body',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Press hands gently into a wall at chest height and hold without moving. Use about 50 percent effort.',
    formCues: ['Gentle effort only', 'No sharp pain', 'Breathe steadily'],
    commonMistakes: ['Pressing too hard', 'Locking elbows'],
    easier: 'Use less pressure.',
    harder: 'Longer hold if pain-free.',
    substitute: 'Wall push-up'
  },
  {
    id: 'dead-bug',
    name: 'Dead bug',
    category: 'Core',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Lie on your back, brace gently, and lower the opposite arm and leg with control while keeping your low back quiet.',
    formCues: ['Low back stays on the floor', 'Slow reach', 'Exhale as you extend'],
    commonMistakes: ['Arching back', 'Moving too fast'],
    easier: 'Move legs only.',
    harder: 'Longer reach and slower return.',
    substitute: 'Heel taps'
  },
  {
    id: 'bird-dog',
    name: 'Bird dog',
    category: 'Core',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'From hands and knees, reach the opposite arm and leg long without shifting your hips.',
    formCues: ['Push floor away gently', 'Level hips throughout', 'Reach long before you lift high'],
    commonMistakes: ['Twisting open', 'Overarching the low back'],
    easier: 'Legs only.',
    harder: 'Pause each reach for one breath.',
    substitute: 'Dead bug'
  },
  {
    id: 'side-plank-knees',
    name: 'Side plank from knees',
    category: 'Core',
    difficulty: 'Beginner',
    elbowLoad: 'Medium',
    howTo: 'Prop on forearm and knees, lift hips to create a straight line from knee to shoulder, and hold.',
    formCues: ['Shoulder stacked over elbow', 'Short hold is fine', 'No elbow pain'],
    commonMistakes: ['Sinking into shoulder', 'Holding through sharp elbow pain'],
    easier: 'Side-lying hip lift with hips on the floor.',
    harder: 'Longer hold or extend the top leg.',
    substitute: 'Heel taps'
  },
  {
    id: 'elevated-plank',
    name: 'Elevated plank',
    category: 'Core',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Place hands on a counter and hold a long, steady plank with soft elbows.',
    formCues: ['Soft elbows — never locked', 'Ribs down', 'Glutes lightly engaged'],
    commonMistakes: ['Locking elbows', 'Sagging hips'],
    easier: 'Use a higher surface.',
    harder: 'Lower surface if pain-free.',
    substitute: 'Dead bug'
  },
  {
    id: 'forearm-plank',
    name: 'Forearm plank',
    category: 'Core',
    difficulty: 'Medium',
    elbowLoad: 'Avoid if sore',
    howTo: 'Hold a forearm plank with elbows cushioned on a mat and shoulders relaxed. Quality over duration.',
    formCues: ['Short quality hold', 'Neck long', 'Stop if elbow pain starts'],
    commonMistakes: ['Ignoring elbow pressure', 'Holding too long'],
    easier: 'Elevated plank',
    harder: 'Longer hold only if fully pain-free.',
    substitute: 'Dead bug'
  },
  {
    id: 'heel-taps',
    name: 'Heel taps',
    category: 'Core',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Lie on your back with knees bent and tap one heel at a time toward the floor while keeping ribs quiet.',
    formCues: ['Small motion', 'Slow breath', 'Pelvis stays level'],
    commonMistakes: ['Arching back', 'Rushing'],
    easier: 'Keep feet closer to your body.',
    harder: 'Reach heels farther away.',
    substitute: 'Dead bug'
  },
  {
    id: 'pallof-no-band',
    name: 'Pallof-style press',
    category: 'Core',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Hold a pillow at chest height, press it forward slowly, and resist any rotation of the torso.',
    formCues: ['Square hips', 'Gentle press', 'Slow controlled return'],
    commonMistakes: ['Shrugging', 'Twisting with the press'],
    easier: 'Shorter reach.',
    harder: 'Pause with arms fully extended.',
    substitute: 'Dead bug'
  },
  {
    id: 'cat-cow',
    name: 'Cat cow',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Move between rounding and gently extending your spine on hands and knees. Let the breath lead the movement.',
    formCues: ['Move slowly', 'Breathe with each motion', 'Pad hands if needed'],
    commonMistakes: ['Forcing range', 'Locking elbows'],
    easier: 'Do it seated in a chair.',
    harder: 'Add a two-breath pause at each end.',
    substitute: "Child\u2019s pose"
  },
  {
    id: 'thread-needle',
    name: 'Thread the needle',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'From hands and knees, reach one arm underneath your body and rotate gently through the upper back.',
    formCues: ['Support arm stays soft', 'Easy breath', 'Only go as far as feels comfortable'],
    commonMistakes: ['Dumping weight into elbow', 'Forcing shoulder rotation'],
    easier: 'Do seated rotation.',
    harder: 'Hold each side for a longer breath.',
    substitute: 'Thoracic open book'
  },
  {
    id: 'hip-flexor-stretch',
    name: 'Hip flexor stretch',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Kneel or stand in a split stance and gently shift your hips forward until you feel a stretch in the front of the rear hip.',
    formCues: ['Tuck pelvis slightly', 'Tall posture', 'Gentle stretch only'],
    commonMistakes: ['Overarching low back', 'Pushing too far'],
    easier: 'Do it standing.',
    harder: 'Reach the same-side arm overhead.',
    substitute: 'Gentle yoga flow'
  },
  {
    id: 'hamstring-floss',
    name: 'Hamstring floss',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Extend and gently bend one leg, moving smoothly through the back of the thigh.',
    formCues: ['Smooth motion', 'No nerve zing or shooting sensation', 'Small comfortable range'],
    commonMistakes: ['Yanking into stretch', 'Pushing through discomfort'],
    easier: 'Reduce range.',
    harder: 'Slow the motion and add a breath at full extension.',
    substitute: 'Figure four stretch'
  },
  {
    id: 'figure-four',
    name: 'Figure four stretch',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Cross one ankle over the opposite thigh and breathe into the hip stretch. Use a chair or lie on your back.',
    formCues: ['Relax shoulders', 'Gently flex the crossed foot', 'No knee pain'],
    commonMistakes: ['Pulling aggressively', 'Twisting the knee'],
    easier: 'Do it seated in a chair.',
    harder: 'Bring legs closer to the chest.',
    substitute: "Child\u2019s pose"
  },
  {
    id: 'childs-pose',
    name: "Child\u2019s pose",
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Fold hips back toward heels and rest arms forward or by your sides comfortably.',
    formCues: ['Support head if useful', 'Easy breath into the back', 'Arms can rest by sides'],
    commonMistakes: ['Forcing shoulders down', 'Ignoring knee discomfort'],
    easier: 'Place a pillow under hips.',
    harder: 'Walk hands to each side for a lat stretch.',
    substitute: 'Figure four stretch'
  },
  {
    id: 'open-book',
    name: 'Thoracic open book',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Lie on your side with knees stacked and rotate the top arm open like a book. Breathe as you rotate.',
    formCues: ['Knees stay stacked', 'Move with breath', 'Do not force the shoulder to touch the floor'],
    commonMistakes: ['Letting knees slide apart', 'Chasing range of motion'],
    easier: 'Use a pillow under the top arm.',
    harder: 'Pause open for two full breaths.',
    substitute: 'Thread the needle'
  },
  {
    id: 'gentle-yoga-flow',
    name: 'Gentle yoga flow',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: "Move through cat cow, child\u2019s pose, low lunge, hamstring floss, and easy twists at your own pace.",
    formCues: ['Stay below strain', 'Skip wrist-heavy shapes', 'Finish calmer than you started'],
    commonMistakes: ['Turning recovery into a workout', 'Holding painful positions'],
    easier: 'Choose three movements only.',
    harder: 'Add a longer walk after.',
    substitute: 'Recovery walk'
  },
  {
    id: 'worlds-greatest-stretch',
    name: "World\u2019s greatest stretch",
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Step into a comfortable lunge, place hands where they feel supported, and rotate through the upper back.',
    formCues: ['Use blocks or a chair if needed', 'Move slowly', 'Keep breath easy'],
    commonMistakes: ['Forcing the front hip', 'Dumping weight into the hands'],
    easier: 'Do the rotation from a high lunge with hands on a chair.',
    harder: 'Pause for two breaths in the rotation.',
    substitute: 'Thoracic open book'
  },
  {
    id: 'hip-circles',
    name: 'Hip circles',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Stand tall and draw slow circles with one hip at a time. Use a wall for balance if useful.',
    formCues: ['Small circles first', 'Quiet ribs', 'No pinching in the hip'],
    commonMistakes: ['Moving too fast', 'Arching the low back'],
    easier: 'Hold a chair or wall.',
    harder: 'Add a slow marching reset between sides.',
    substitute: 'Marching'
  },
  {
    id: 'arm-circles',
    name: 'Arm circles',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Make small, slow arm circles forward and then backward with relaxed shoulders.',
    formCues: ['Small range to start', 'Soft elbows', 'Shoulders away from ears'],
    commonMistakes: ['Swinging fast', 'Locking elbows'],
    easier: 'Bend elbows more.',
    harder: 'Make slightly larger circles if pain-free.',
    substitute: 'Shoulder controlled circles'
  },
  {
    id: 'shoulder-cars',
    name: 'Shoulder controlled circles',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Move one arm through the largest comfortable shoulder circle you can fully control.',
    formCues: ['Slow control throughout', 'Ribs stay down', 'Pain-free range only'],
    commonMistakes: ['Chasing range over control', 'Shrugging'],
    easier: 'Use a smaller circle.',
    harder: 'Pause at any sticky spot without forcing.',
    substitute: 'Scapular wall slide'
  },
  {
    id: 'marching',
    name: 'Marching',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'March in place with tall posture and quiet, steady breathing.',
    formCues: ['Stand tall', 'Foot lands quietly', 'Arms relaxed by sides'],
    commonMistakes: ['Leaning back', 'Rushing'],
    easier: 'Hold a chair lightly.',
    harder: 'Slow the lowering foot for more control.',
    substitute: 'Walking'
  },
  {
    id: 'walking',
    name: 'Walking',
    category: 'Cardio',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Walk at a pace that lets you breathe easily and finish feeling clearer, not drained.',
    formCues: ['Tall posture', 'Relaxed shoulders', 'Easy pace before fast pace'],
    commonMistakes: ['Turning every walk into a test', 'Increasing pace before duration'],
    easier: 'Take a shorter walk or split it into two walks.',
    harder: 'Add time before adding speed.',
    substitute: 'Bike, swimming, elliptical, or easy hike'
  },
  {
    id: 'walking-lunge',
    name: 'Walking lunge',
    category: 'Lower body',
    difficulty: 'Harder',
    elbowLoad: 'None',
    howTo: 'Step forward into a short lunge, stand tall, and repeat. Only if hips and knees feel good.',
    formCues: ['Short step', 'Front knee tracks toes', 'Tall chest throughout'],
    commonMistakes: ['Taking giant steps', 'Dropping hard into the bottom'],
    easier: 'Reverse lunge',
    harder: 'Slow the lowering phase.',
    substitute: 'Step-up'
  },
  {
    id: 'single-leg-balance',
    name: 'Single-leg balance',
    category: 'Balance',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Stand on one foot near a wall or chair and hold steady without gripping the floor.',
    formCues: ['Soft standing knee', 'Tall posture', 'Use support before wobbling hard'],
    commonMistakes: ['Locking the standing knee', 'Holding breath'],
    easier: 'Keep toes of the free foot lightly on the floor.',
    harder: 'Add a slow reach or longer hold.',
    substitute: 'Step-up'
  },
  {
    id: 'farmer-carry',
    name: 'Backpack farmer carry',
    category: 'Carry',
    difficulty: 'Medium',
    elbowLoad: 'Low',
    howTo: 'Carry a loaded backpack at your side or hugged to your chest while walking slowly with tall posture.',
    formCues: ['Tall posture', 'Shoulders level', 'Light enough to stay smooth'],
    commonMistakes: ['Leaning away from the load', 'Gripping through elbow pain'],
    easier: 'Hug the backpack to your chest.',
    harder: 'Walk farther before adding weight.',
    substitute: 'Single-leg balance'
  },
  {
    id: 'doorway-pec-stretch',
    name: 'Doorway pec stretch',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'Low',
    howTo: 'Place your forearm on a doorway and gently turn away until you feel the chest open.',
    formCues: ['Gentle stretch only', 'Shoulder stays down', 'No tingling in arm or hand'],
    commonMistakes: ['Cranking the shoulder', 'Holding through numbness or tingling'],
    easier: 'Lower the arm angle.',
    harder: 'Take two slow breaths in the stretch.',
    substitute: 'Thoracic open book'
  },
  {
    id: 'calf-stretch',
    name: 'Calf stretch',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Step one foot back, press the heel gently into the floor, and breathe into the calf.',
    formCues: ['Heel heavy into the floor', 'Toes facing forward', 'Gentle pressure'],
    commonMistakes: ['Turning the foot out', 'Forcing the heel down hard'],
    easier: 'Use a smaller step.',
    harder: 'Bend the back knee slightly to shift the stretch lower.',
    substitute: 'Hamstring floss'
  },
  {
    id: 'neck-mobility',
    name: 'Neck mobility',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Move the neck through slow nods, gentle turns, and easy side bends.',
    formCues: ['Tiny range to start', 'No stretching into symptoms', 'Jaw relaxed'],
    commonMistakes: ['Pulling on the head', 'Moving quickly'],
    easier: 'Do only slow turns.',
    harder: 'Add slow breath holds at comfortable end ranges.',
    substitute: 'Deep breathing'
  },
  {
    id: 'deep-breathing',
    name: 'Deep breathing',
    category: 'Mobility',
    difficulty: 'Beginner',
    elbowLoad: 'None',
    howTo: 'Breathe slowly through the nose, letting the ribs expand without forcing a huge breath.',
    formCues: ['Jaw relaxed', 'Shoulders heavy', 'Slow exhale longer than inhale'],
    commonMistakes: ['Forcing breath size', 'Shrugging the shoulders'],
    easier: 'Lie on your back with knees bent.',
    harder: 'Add a longer exhale.',
    substitute: "Child\u2019s pose"
  },
  {
    id: 'mace-halo',
    name: 'Mace halo',
    category: 'Optional mace',
    difficulty: 'Harder',
    elbowLoad: 'Avoid if sore',
    howTo: 'Optional only: circle a very light mace around the head with slow, deliberate control.',
    formCues: ['Light load', 'Pain-free elbows only', 'Slow controlled path'],
    commonMistakes: ['Using too much weight', 'Pushing through elbow symptoms'],
    easier: 'Mace offset hold.',
    harder: 'Do not progress unless elbows feel perfect.',
    substitute: 'Standing shoulder raises'
  },
  {
    id: 'mace-360-prep',
    name: 'Mace 360 prep',
    category: 'Optional mace',
    difficulty: 'Harder',
    elbowLoad: 'Avoid if sore',
    howTo: 'Optional only: rehearse a partial mace 360 path without speed or strain.',
    formCues: ['Prep, not performance', 'Soft grip', 'Stop for any elbow pain'],
    commonMistakes: ['Moving fast', 'Letting elbows flare painfully'],
    easier: 'Mace offset hold.',
    harder: 'Only with coaching and fully pain-free reps.',
    substitute: 'Scapular wall slide'
  },
  {
    id: 'mace-offset-hold',
    name: 'Mace offset hold',
    category: 'Optional mace',
    difficulty: 'Medium',
    elbowLoad: 'Avoid if sore',
    howTo: 'Optional only: hold a light mace offset for a short, steady anti-rotation hold.',
    formCues: ['Short hold', 'Quiet ribs', 'No elbow strain'],
    commonMistakes: ['Holding too long', 'Gripping too hard'],
    easier: 'Pallof-style press.',
    harder: 'Longer hold only if pain-free.',
    substitute: 'Pallof-style press'
  }
];

const schedule: Array<{ day: string; type: WorkoutType }> = [
  { day: 'Monday', type: 'Strength A' },
  { day: 'Tuesday', type: 'Yoga + Walk' },
  { day: 'Wednesday', type: 'Strength B' },
  { day: 'Thursday', type: 'Recovery Walk' },
  { day: 'Friday', type: 'Strength C' },
  { day: 'Saturday', type: 'Optional' },
  { day: 'Sunday', type: 'Rest' }
];

const phaseForWeek = (week: number) => phases[Math.floor((week - 1) / 4)].name;

// Warm-up library: all are appropriate mobility/activation exercises, not strength work.
const warmUpLibrary = [
  'cat-cow',
  'worlds-greatest-stretch',
  'hip-circles',
  'arm-circles',
  'shoulder-cars',
  'thread-needle',
  'hip-flexor-stretch',
  'marching',
  'open-book',
  'deep-breathing'
];

const coolDownLibrary = [
  'hamstring-floss',
  'hip-flexor-stretch',
  'childs-pose',
  'figure-four',
  'doorway-pec-stretch',
  'open-book',
  'calf-stretch',
  'neck-mobility'
];

const choose = (items: string[], start: number, count: number) =>
  chooseAvoiding(items, start, count);

const chooseAvoiding = (items: string[], start: number, count: number, avoid: string[] = []) => {
  const blocked = new Set(avoid);
  const picked: string[] = [];
  for (let offset = 0; picked.length < count && offset < items.length * 2; offset += 1) {
    const item = items[(start + offset) % items.length];
    if (!blocked.has(item) && !picked.includes(item)) {
      picked.push(item);
    }
  }
  return picked;
};

const isDeloadWeek = (week: number) => week % 4 === 0;

const phaseRules = (week: number) => {
  if (week <= 4) {
    return {
      effort: 'Easy effort: 5-6 out of 10. Finish feeling like one more set was available.',
      rest: 'Rest 60-90 seconds between sets.',
      note: 'Create the habit. No soreness should last longer than 48 hours.',
      walk: 'Aim for 7,000 daily steps if that feels realistic. Add duration before pace.'
    };
  }
  if (week <= 8) {
    return {
      effort: 'Moderate effort: about 6 out of 10. Smooth reps matter more than harder versions.',
      rest: 'Rest 60-75 seconds between sets.',
      note: 'Increase total work gently. Add repetitions before adding another set.',
      walk: 'Aim for 7,500-8,500 daily steps. Easy walking is the main cardio.'
    };
  }
  if (week <= 12) {
    return {
      effort: 'Moderate effort: 6-7 out of 10. You should still have a clean rep left.',
      rest: 'Rest 60-75 seconds between sets.',
      note: 'This phase builds muscle with tempo, single-leg work, posture, and carries.',
      walk: 'Aim for 8,000-9,000 daily steps. Longer walks beat rushed walks.'
    };
  }
  if (week <= 16) {
    return {
      effort: 'Moderately hard effort: about 7 out of 10. Strong, never wrecked.',
      rest: 'Rest 60 seconds between sets.',
      note: 'Strength comes from better control, slower tempo, and confident single-leg work.',
      walk: 'Aim for 8,500-9,500 daily steps. Keep one walk conversational and easy.'
    };
  }
  if (week <= 20) {
    return {
      effort: 'Moderately hard effort: 7 out of 10. Shorter rests are optional, form is not.',
      rest: 'Rest 45-60 seconds between sets.',
      note: 'Higher density can support definition, but never trade posture for speed.',
      walk: 'Aim for 9,000-10,000 daily steps when recovery feels good.'
    };
  }
  return {
    effort: 'Confident effort: 7 out of 10. Use your strongest pain-free version.',
    rest: 'Rest 45-75 seconds between sets.',
    note: 'You should feel noticeably stronger now. Keep the plan sustainable.',
    walk: 'Aim for 9,000-10,000 daily steps, with one longer relaxed walk most weeks.'
  };
};

const progression = (week: number) => {
  const weekInPhase = ((week - 1) % 4) + 1;
  const deload = isDeloadWeek(week);
  if (deload) {
    return {
      sets: '2 sets',
      reps: week <= 4 ? '8 easy reps' : '8-10 easy reps',
      hold: week <= 8 ? '15-20 seconds' : '20-25 seconds',
      carry: '2 carries · 20 seconds each',
      finisher: 'Skip the finisher this week.',
      note: 'Deload week: reduce volume by about 30 percent and do not chase personal records.'
    };
  }
  if (weekInPhase === 1) {
    return { sets: '2 sets', reps: '8 reps', hold: '20 seconds', carry: '2 carries · 30 seconds each', finisher: 'Optional 4-minute easy circuit.' };
  }
  if (weekInPhase === 2) {
    return { sets: '2 sets', reps: '10 reps', hold: '25 seconds', carry: '2 carries · 40 seconds each', finisher: 'Optional 5-minute easy circuit.' };
  }
  return { sets: '3 sets', reps: '10 reps', hold: '30 seconds', carry: '3 carries · 30 seconds each', finisher: 'Optional 6-minute controlled circuit.' };
};

// ─── Prescription helpers ───────────────────────────────────────────────────

export const warmUpPrescriptionFor = (id: string): string => {
  const map: Record<string, string> = {
    'cat-cow': '8 slow reps',
    'worlds-greatest-stretch': '5 each side',
    'hip-circles': '10 each direction',
    'arm-circles': '10 forward, 10 backward',
    'shoulder-cars': '5 each direction',
    'thread-needle': '5 each side',
    'hip-flexor-stretch': '30 seconds each side',
    'marching': '60 seconds',
    'open-book': '8 each side',
    'deep-breathing': '5 slow breaths'
  };
  return map[id] ?? '8 reps';
};

export const coolDownPrescriptionFor = (id: string): string => {
  const map: Record<string, string> = {
    'hamstring-floss': '8 slow reps each side',
    'hip-flexor-stretch': 'Hold 30-45 sec each side',
    'childs-pose': 'Hold 45-60 seconds',
    'figure-four': 'Hold 30-45 sec each side',
    'doorway-pec-stretch': 'Hold 30 sec each side',
    'open-book': '8 each side · 2-breath pause',
    'calf-stretch': 'Hold 30 sec each side',
    'neck-mobility': '5 each direction, easy range',
    'thread-needle': 'Hold 30 sec each side',
    'deep-breathing': '5 slow breaths',
    'cat-cow': '8 slow reps'
  };
  return map[id] ?? 'Hold 30 seconds';
};

export const workoutPrescriptionFor = (id: string, week: number): string => {
  const dose = progression(week);
  const sets = dose.sets;
  const reps = dose.reps;
  const hold = dose.hold;

  // Timed hold — bilateral
  if (['elevated-plank', 'forearm-plank', 'wall-sit'].includes(id)) {
    return `${sets} · Hold ${hold}`;
  }
  // Timed hold — each side
  if (id === 'side-plank-knees') {
    return `${sets} · Hold ${hold} each side`;
  }
  // Balance hold — each side
  if (id === 'single-leg-balance') {
    return `${sets} · Hold ${hold} each side`;
  }
  // Core reps — each side
  if (['dead-bug', 'bird-dog', 'heel-taps'].includes(id)) {
    return `${sets} · ${reps} each side`;
  }
  // Anti-rotation press — each side
  if (id === 'pallof-no-band') {
    return `${sets} · 8 reps each side`;
  }
  // Unilateral lower body — each side
  if (['reverse-lunge', 'step-up', 'kickstand-rdl', 'walking-lunge', 'single-leg-glute-bridge'].includes(id)) {
    return `${sets} · ${reps} each side`;
  }
  // Marching glute bridge — slow marches
  if (id === 'marching-glute-bridge') {
    return `${sets} · 10 slow marches`;
  }
  // Carry
  if (id === 'farmer-carry') {
    return dose.carry;
  }
  // Default: bilateral sets × reps
  return `${sets} · ${reps}`;
};

export const mobilityPrescriptionFor = (id: string): string => {
  const map: Record<string, string> = {
    'walking': '25-45 minutes, easy conversational pace',
    'cat-cow': '8 slow reps',
    'worlds-greatest-stretch': '5 each side',
    'hip-flexor-stretch': 'Hold 30-45 seconds each side',
    'hamstring-floss': '8 slow reps each side',
    'figure-four': 'Hold 30-45 sec each side',
    'open-book': '8 each side',
    'thread-needle': '5 each side',
    'hip-circles': '10 each direction',
    'calf-stretch': 'Hold 30 sec each side',
    'neck-mobility': '5 each direction',
    'gentle-yoga-flow': '15-20 minutes',
    'mace-offset-hold': '2 sets · Hold 20 seconds',
    'mace-halo': '2 sets · 5 each direction',
    'mace-360-prep': '2 sets · 5 each direction'
  };
  return map[id] ?? '';
};

// ─── Exercise plan ──────────────────────────────────────────────────────────

const phaseExercisePlan = (week: number, type: WorkoutType) => {
  const phaseIndex = Math.floor((week - 1) / 4);

  // Push: A progresses steadily. B trails one step for more elbow recovery time. C runs slightly ahead on Fridays.
  const strengthAPush = ['wall-push-up', 'counter-push-up', 'counter-push-up', 'incline-push-up', 'incline-push-up', 'incline-push-up'][phaseIndex];
  const strengthBPush = ['isometric-wall-press', 'wall-push-up', 'counter-push-up', 'counter-push-up', 'incline-push-up', 'incline-push-up'][phaseIndex];
  const strengthCPush = ['wall-push-up', 'counter-push-up', 'incline-push-up', 'incline-push-up', 'incline-push-up', 'incline-push-up'][phaseIndex];

  // Squat / lower body: each workout uses different variations in later phases for variety.
  const strengthASquat = ['chair-squat', 'bodyweight-squat', 'tempo-squat', 'tempo-squat', 'tempo-squat', 'tempo-squat'][phaseIndex];
  const strengthCLower = ['chair-squat', 'bodyweight-squat', 'tempo-squat', 'step-up', 'walking-lunge', 'walking-lunge'][phaseIndex];
  const strengthBLower = phaseIndex <= 1 ? 'step-up' : 'reverse-lunge';

  // Hinge: progresses from glute bridge → bilateral RDL → unilateral kickstand hinge.
  const hinge = ['glute-bridge', 'romanian-deadlift', 'kickstand-rdl', 'kickstand-rdl', 'kickstand-rdl', 'kickstand-rdl'][phaseIndex];

  // Pull: begins with shoulder activation, progresses to loaded row.
  const pull = phaseIndex === 0 ? 'standing-ytw' : 'backpack-row';

  // Core: each workout uses a different exercise to prevent repetition across the week.
  const strengthACore = ['dead-bug', 'bird-dog', 'elevated-plank', 'forearm-plank', 'forearm-plank', 'side-plank-knees'][phaseIndex];
  const strengthBCore = ['bird-dog', 'heel-taps', 'pallof-no-band', 'dead-bug', 'side-plank-knees', 'pallof-no-band'][phaseIndex];
  const strengthCCore = ['heel-taps', 'dead-bug', 'bird-dog', 'elevated-plank', 'pallof-no-band', 'forearm-plank'][phaseIndex];

  // Balance: cycles through variations across workouts and phases.
  const strengthABalance = ['single-leg-balance', 'single-leg-balance', 'step-up', 'single-leg-balance', 'step-up', 'reverse-lunge'][phaseIndex];
  const strengthCBalance = ['single-leg-balance', 'single-leg-balance', 'single-leg-balance', 'reverse-lunge', 'single-leg-balance', 'step-up'][phaseIndex];

  // Carries: calf raise as simple lower-body finisher early, progresses to loaded farmer carry.
  const carry = phaseIndex >= 2 ? 'farmer-carry' : 'calf-raise';

  // Glute isolation for Strength C second exercise slot.
  const strengthCGlute = ['glute-bridge', 'marching-glute-bridge', 'marching-glute-bridge', 'marching-glute-bridge', 'single-leg-glute-bridge', 'single-leg-glute-bridge'][phaseIndex];

  // Strength A: squat · hinge · pull · push · core · balance
  if (type === 'Strength A') return [strengthASquat, hinge, pull, strengthAPush, strengthACore, strengthABalance];
  // Strength B: lower · hinge · pull · push · core · carry
  if (type === 'Strength B') return [strengthBLower, hinge, pull, strengthBPush, strengthBCore, carry];
  // Strength C: lower variety · glute isolation · pull · push · core · balance · carry
  return [strengthCLower, strengthCGlute, pull, strengthCPush, strengthCCore, strengthCBalance, carry];
};

// ─── Prescriptions ──────────────────────────────────────────────────────────────

const strengthPrescription = (week: number) => {
  const dose = progression(week);
  const rules = phaseRules(week);
  const deloadText = isDeloadWeek(week) ? ' Deload week: reduce volume by 30 percent.' : '';
  return `${dose.sets} · ${dose.reps}. ${rules.rest}${deloadText} ${dose.finisher}`;
};

const nonStrengthPrescription = (week: number, type: WorkoutType) => {
  const deloadText = isDeloadWeek(week) ? ' Keep it especially easy — this is a deload week.' : '';
  if (type === 'Yoga + Walk') return `Walk 25-40 minutes at a conversational pace, then 15-25 minutes of easy yoga or mobility.${deloadText}`;
  if (type === 'Recovery Walk') return `Recovery walk 25-45 minutes plus 10 minutes of mobility.${deloadText}`;
  if (type === 'Optional') {
    if (week >= 21) return 'Optional long walk, easy hike, yoga, or very light steel mace practice only if the elbow feels calm.';
    return 'Optional yoga, easy hike, longer walk, or full rest. Choose what protects next week.';
  }
  return 'Complete rest. Walking is optional and should feel restorative.';
};

const dayFocus = (week: number, type: WorkoutType) => {
  const rules = phaseRules(week);
  if (type.startsWith('Strength')) return `${rules.note} Prioritize technique, posture, and leaving one clean set in reserve.`;
  if (type === 'Yoga + Walk') return 'Yoga is recovery, not punishment. Keep the walk conversational.';
  if (type === 'Recovery Walk') return 'Move blood, loosen hips and upper back, and finish fresher than you started.';
  if (type === 'Optional') return 'Optional means optional. Long-term consistency beats proving a point.';
  return 'Complete rest is part of the program.';
};

const dayExercises = (week: number, type: WorkoutType) => {
  if (type.startsWith('Strength')) return phaseExercisePlan(week, type);
  if (type === 'Yoga + Walk') return ['walking', 'cat-cow', 'worlds-greatest-stretch', 'hip-flexor-stretch', 'hamstring-floss', 'figure-four', 'open-book'];
  if (type === 'Recovery Walk') return ['walking', 'cat-cow', 'thread-needle', 'hip-circles', 'calf-stretch', 'neck-mobility'];
  if (type === 'Optional') return week >= 21 ? ['gentle-yoga-flow', 'mace-offset-hold', 'mace-halo', 'mace-360-prep'] : ['gentle-yoga-flow', 'open-book', 'figure-four'];
  return [];
};

// ─── Unique weekly coaching notes ───────────────────────────────────────────

const weeklyCoachNote = (week: number): string => {
  if (isDeloadWeek(week)) {
    return 'Deload week. Reduce volume by roughly 30 percent, keep quality high, and finish each session feeling better than when you started.';
  }
  const notes: Record<number, string> = {
    1: 'Slow and controlled beats fast. The goal this week is to arrive, move well, and leave without soreness that lasts more than 48 hours.',
    2: 'Add reps only when the current ones look clean. No rushing the timeline.',
    3: 'Leave one or two reps in the tank every set. You should never finish a set feeling wrecked.',
    5: 'The habit is forming. Show up the same way you did in Week 1 — quiet, consistent, intentional.',
    6: 'Smooth reps build more than hard reps. Keep the same quality standard at slightly higher volume.',
    7: 'You should feel noticeably more comfortable in these movements. That comfort is real progress.',
    9: 'Tempo is your best tool now. Slow the lowering phase and notice how much harder control is than speed.',
    10: 'Single-leg work reveals imbalances. Let it. That is information, not a problem.',
    11: 'Keep breathing throughout every rep. If you are holding your breath, the pace is too fast.',
    13: 'Strength is controlled movement. One clean paused rep is worth three sloppy ones.',
    14: 'Posture under load matters. Keep the chest tall and ribs stacked.',
    15: 'You are in your strongest phase yet. Use deliberate tempo, not heavier effort.',
    17: 'Reduce rest only when form stays sharp. Never sacrifice quality for pace.',
    18: 'Density builds definition. Keep the quality while adding slightly more total work.',
    19: 'You have earned this phase. Do not trade posture for speed.',
    21: 'Use your strongest pain-free version of every exercise. No heroics.',
    22: 'Consistency across six months beats any single session. Keep it sustainable.',
    23: 'Finish the program the way you started it — with intention and patience.'
  };
  return notes[week] ?? 'Keep quality high. Technique first, then reps, then sets, then harder variations.';
};

// ─── Plan generator ──────────────────────────────────────────────────────────

export const generateWorkoutPlan = (): WorkoutDay[] => {
  const days: WorkoutDay[] = [];
  for (let week = 1; week <= 24; week += 1) {
    for (const item of schedule) {
      const isStrength = item.type.startsWith('Strength');
      const rules = phaseRules(week);
      const warmUpStart = (week + schedule.findIndex((day) => day.day === item.day)) % warmUpLibrary.length;
      const coolDownStart = (week + schedule.findIndex((day) => day.day === item.day)) % coolDownLibrary.length;

      const exerciseIds = dayExercises(week, item.type);
      const warmUpIds = item.type === 'Rest' ? [] : chooseAvoiding(warmUpLibrary, warmUpStart, 5, exerciseIds);
      const coolDownIds = item.type === 'Rest' ? [] : chooseAvoiding(coolDownLibrary, coolDownStart, 4, [...exerciseIds, ...warmUpIds]);

      days.push({
        id: `week-${week}-${item.day.toLowerCase()}`,
        week,
        day: item.day,
        phase: phaseForWeek(week),
        type: item.type,
        focus: dayFocus(week, item.type),
        exercises: exerciseIds,
        setsReps: isStrength ? strengthPrescription(week) : nonStrengthPrescription(week, item.type),
        warmUp: warmUpIds,
        coolDown: coolDownIds,
        effortTarget: item.type.startsWith('Strength') ? rules.effort : 'Easy effort. You should be able to breathe through your nose or hold a conversation.',
        walkingTarget: rules.walk,
        coachNote: weeklyCoachNote(week),
        completed: false
      });
    }
  }
  return days;
};

export const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));
