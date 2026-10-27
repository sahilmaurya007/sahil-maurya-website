/* blogbody3.js - Full blog story PART 3 (of 3): Chapters 7-12 + Epilogue. DO NOT EDIT. */
window.SM_BLOG_BODY_3 = `
### Chapter 7: Constraints, Clock Crossings, and the Things We Cannot Ignore

As I progressed through my M.Tech, I began to appreciate the importance of constraints.

In FPGA design, constraints describe the timing and physical interface requirements that guide implementation and analysis.

An XDC file may specify clock periods, input and output delays, pin assignments, and I/O standards, among other requirements.

Incorrect or incomplete constraints can lead to misleading timing analysis or implementation problems.

A constraint is not merely a line in a file.

It tells the tools what conditions the design is expected to satisfy.

That reminded me of something important about relationships: expectations must be communicated.

People cannot reliably satisfy requirements that have never been expressed or understood.

Unspoken assumptions can become sources of disappointment. Clear communication does not eliminate every disagreement, but it gives both people a better chance of understanding what is expected.

Then there are clock-domain crossings.

When a signal moves between clock domains, the receiving logic may encounter metastability or other synchronisation challenges. Appropriate techniques, such as synchroniser chains for suitable single-bit signals and carefully designed handshaking or asynchronous FIFOs for more complex transfers, help manage these risks.

The details depend on the design.

But the broader idea is that communication between different timing domains requires deliberate engineering.

I found the metaphor difficult to ignore.

Two people may live in different emotional worlds. One processes a difficult conversation immediately; the other needs time. One expresses affection through words; the other expresses it through actions.

Neither difference automatically means that something is broken.

But crossing those differences without understanding them can create confusion.

A relationship needs its own forms of synchronisation: patience, clarification, listening, and the willingness to check whether a message has actually been understood.

तेरी दुनिया की रफ़्तार कुछ और रही,
मेरी ख़ामोशी की वजह कुछ और रही।
हमने समझा कि फ़ासले बढ़ रहे हैं,
शायद बस हमारी घड़ियों की चाल अलग रही।

Not every difference needs to be eliminated.

Sometimes it needs to be understood.

And sometimes the most meaningful thing two people can do is stop assuming that the other person operates on the same clock.

### Chapter 8: The ILA - Learning to Observe Before You Judge

There is another tool that became important in my hardware journey: the Integrated Logic Analyzer, or ILA.

An ILA allows an engineer to capture selected internal signals while an FPGA design is running.

Instead of guessing what the hardware is doing, we can inspect signal transitions, state-machine behaviour, handshakes, counters, and other internal events.

When a design fails, observation becomes more valuable than speculation.

You cannot solve every problem by repeatedly changing code without understanding what is happening.

Sometimes you need to stop, collect evidence, inspect the waveforms, and identify the actual cause.

That principle has applications far beyond engineering.

When someone behaves differently from what we expected, our first reaction may be to form an explanation.

Perhaps they are angry. Perhaps they have lost interest. Perhaps we have done something wrong.

But an assumption is not the same as evidence.

A person may be tired, distracted, worried, or dealing with something they have not yet explained.

Just as an ILA helps us inspect a circuit's actual behaviour, careful conversation helps us understand another person's perspective.

Of course, people are not digital waveforms, and emotions cannot be completely captured by observing a few external signals.

But the lesson remains valuable:

Observe before you conclude. Ask before you assume. Understand before you judge.

हर ख़ामोशी का मतलब नाराज़गी नहीं होता,
हर दूर जाने वाला बेवफ़ाई नहीं होता।
कभी पूछ भी लिया करो दिल का हाल,
हर दर्द चेहरे पर दिखाई नहीं होता।

Perhaps that is why I have always appreciated debugging.

It teaches you to look for the cause rather than punish the symptom.

### Chapter 9: Simulation - A Safe Place to Be Wrong

One of the most important habits I developed as an engineer was to verify my designs before relying on the physical implementation.

A testbench allows us to apply inputs, check expected outputs, exercise different operating conditions, and investigate corner cases.

Simulation cannot prove that every possible problem has been eliminated, and it does not replace timing analysis or hardware testing.

But it gives us an invaluable opportunity to discover many mistakes before they become more expensive to fix.

In simulation, failure is information.

An incorrect output tells you that something needs investigation. An unexpected state transition gives you a clue. A failed assertion can expose an assumption that was never valid.

The goal is not to avoid every failure.

The goal is to make failures informative.

I have often wondered why we are so much harsher with ourselves in life than we are with our designs.

When a circuit fails, we investigate it.

When a simulation produces an unexpected result, we inspect the conditions.

When an implementation violates timing, we analyse the critical paths.

But when our own lives fail to follow the plans we made, we sometimes treat the failure as proof that we are incapable of succeeding.

We forget that one unsuccessful attempt does not describe the entire system.

A difficult semester does not define an entire career.

A rejected opportunity does not define a person's potential.

A painful experience does not have to become the permanent architecture of our future.

We still have to acknowledge our mistakes and accept their consequences. Some losses cannot simply be undone. Some opportunities do not return.

But even then, we can learn something that changes what we do next.

हार को अपनी आख़िरी कहानी मत बनाना,
टूटे हुए ख़्वाबों को अपनी पहचान मत बनाना।
जो आज नहीं हुआ, उससे सबक़ ले लेना,
मगर कल के दरवाज़े पर आज का ताला मत लगाना।

Engineering taught me that testing is not an admission of weakness.

It is a commitment to understanding the truth before declaring something ready.

Perhaps we should offer ourselves the same honesty and patience.

### Chapter 10: From a Blinking LED to Post-Quantum Cryptography

Over time, my interest in digital hardware developed into a deeper interest in architecture design and cryptographic acceleration.

The simple blinking LED was only an introduction to the larger world of programmable logic.

As I explored VLSI and digital system design, I became interested in how specialised hardware could improve the performance and efficiency of computationally demanding algorithms.

One of the areas that captured my attention was post-quantum cryptography.

Quantum computing raises important questions about the long-term security of widely used cryptographic systems. Post-quantum cryptography develops cryptographic algorithms designed to resist attacks from both classical and quantum computers.

This is where algorithms, mathematics, and hardware architecture meet.

My research interests led me to cryptographic arithmetic, including modular multiplication and the polynomial operations used in lattice-based cryptography.

I explored hardware approaches involving K-RED, Plantard and Barrett-based modular multiplication, along with arithmetic associated with Ring Learning With Errors (R-LWE).

In these designs, a seemingly small arithmetic operation can become a major architectural consideration.

The choice of algorithm, the width of the datapath, the number of pipeline stages, the availability of DSP resources, the use of LUTs, and the management of memory can all affect the implementation.

An architecture that performs well mathematically may not be the most efficient implementation in hardware.

The designer must consider area, performance, power, verification, and the limitations of the target platform.

I also became interested in accelerators for CRYSTALS-Kyber, whose underlying key-encapsulation mechanism was standardised by NIST as ML-KEM.

These research problems demanded a different level of discipline.

It was no longer enough to make a light blink or a counter increment.

I had to think about arithmetic correctness, resource utilisation, clock cycles, data movement, and the relationship between algorithmic requirements and hardware implementation.

I also explored RISC-V-based system-on-chip architectures and the possibilities of building specialised digital systems around programmable and open instruction-set architectures.

The journey was challenging, but I could still recognise the same pattern that had fascinated me on that first evening.

Imagine a solution.

Describe it precisely.

Verify its behaviour.

Implement it.

Measure its performance.

Investigate the failures.

Improve the design.

Repeat.

The scale had changed dramatically, but the underlying philosophy remained the same.

And somewhere beneath the research papers, RTL modules, synthesis reports, and implementation constraints, the excitement of that first blinking LED was still alive.

वो पहली रोशनी आज भी मेरे भीतर जलती है,
हर नई चुनौती मुझे फिर से गढ़ती है।
सफ़र बदल गया, मंज़िलें बदलती रहीं,
मगर बनाने की चाह अब भी वहीं पलती है।

I completed my M.Tech at IIIT Guwahati as a batch topper and eventually carried that curiosity into my research journey at IIT Mandi.

Today, as a research scholar in the School of Computing and Electrical Engineering, I continue to explore the relationship between digital architecture, efficient computation, and practical hardware implementation.

The romance never left.

It simply acquired more technical vocabulary.

### Chapter 11: The Difference Between a Perfect Circuit and a Meaningful Life

Engineering rewards precision.

We define requirements, establish constraints, verify behaviour, and measure whether a design meets its specifications.

In many cases, we want the implementation to satisfy clearly defined objectives.

Life is less straightforward.

There is no universal testbench for happiness. There is no single timing report that tells us whether we have made the right decision. There is no synthesis tool that can convert every complicated emotion into a perfectly optimised result.

And perhaps there should not be.

The mistake is not in wanting to improve ourselves.

The mistake is in believing that improvement means eliminating every imperfection.

A circuit can be designed to meet specific requirements, but a person is not a static specification sheet.

We change as we encounter new people, experience loss, discover new interests, and reconsider the beliefs we once held with certainty.

Some changes make us more confident. Others make us more cautious.

Some teach us how to love. Others teach us how to let go.

The important thing is not to become someone who never makes mistakes.

It is to become someone who can recognise a mistake without allowing it to define everything that follows.

Antoine de Saint-Exupéry expressed the idea of perfection through the principle of having nothing left to remove rather than nothing left to add.

In hardware design, that idea often resonates with the pursuit of simplicity: unnecessary logic, excessive resource usage, and avoidable complexity can all undermine a good architecture.

But in life, simplicity does not always mean removing more.

Sometimes it means accepting that we cannot control every outcome.

Sometimes it means saying what we feel instead of constructing elaborate explanations.

Sometimes it means recognising that a person can matter to us even if the story does not unfold the way we imagined.

And sometimes it means allowing an unanswered question to remain unanswered.

मुकम्मल होने की चाह में अधूरे न रह जाना,
हर मोड़ पर ख़ुद से ही दूर न हो जाना।
कुछ कमियाँ भी तुम्हारी कहानी का हिस्सा हैं,
हर पन्ने को मिटाकर नया लिखने न लग जाना।

I still believe in optimisation.

But I have learned that the most meaningful things in life cannot always be reduced to an optimisation problem.

### Chapter 12: The Question I Never Answered

There is one part of this story that does not belong in a timing report.

I never properly told that girl how much her question had affected me.

Perhaps I was too young to understand it at the time. Perhaps I assumed there would always be another evening, another conversation, another opportunity to explain what I had been thinking.

Life has a way of reminding us that opportunities are not guaranteed.

Some conversations remain unfinished.

Some people leave behind questions that become more meaningful with time.

And some memories stay with us not because something extraordinary happened, but because something ordinary revealed an extraordinary possibility.

I do not know whether she will ever read this.

I do not know whether she remembers that evening, the laboratory, or the question she asked while I was struggling with my timing report.

Perhaps she remembers it clearly.

Perhaps it was only a passing thought for her.

Either way, I am grateful that she asked it.

Because that question gave me a way to think about change that extended beyond the laboratory.

It reminded me that a person does not have to remain trapped inside an old version of themselves.

It reminded me that growth is possible, that humility matters, and that sometimes the people who change us the most are not the people who give us the longest speeches.

They are the people who ask one honest question at exactly the right moment.

तुम्हें शायद याद भी न हो वो शाम पुरानी,
मेरे लिए मगर बन गई वो एक कहानी।
तुमने तो बस एक सवाल हवा में उछाला था,
मैंने उसी में अपनी सोच का नया आसमान पाया था।

I never intended to turn a technical journey into a love letter.

Yet here I am, writing about an FPGA and remembering a girl.

Perhaps that is what makes the story worth telling.

The board taught me how to create something from logic.

The research taught me how to approach difficult problems.

And her question reminded me that understanding a person can be far more complicated than understanding a circuit - and infinitely more personal.

### Epilogue: Life Is an FPGA

If there is one idea I have carried from that first development board into my research life, it is this:

Your current configuration does not have to be your final configuration.

You can learn.

You can reconsider.

You can rebuild.

You can fail at something important and still discover a better way forward.

But reconfiguration requires more than wishing for a different outcome. It requires understanding what went wrong, accepting the constraints you cannot change, and having the courage to change what you can.

In hardware, the architecture must satisfy the physical and timing limits of the device.

In life, we must recognise our responsibilities, respect other people's boundaries, and remain honest about the consequences of our choices.

And in love, perhaps the most important constraint is this: never ask another person to lose their identity simply to make your own life more comfortable.

A meaningful relationship is not a project in which one person becomes the designer and the other becomes the hardware.

It is a collaboration between two people who retain their individuality while choosing to build something together.

We will make mistakes.

Our plans will fail.

Sometimes our carefully constructed expectations will not survive contact with reality.

But we can still learn from the experience, make better decisions, and move forward without pretending that our past never happened.

The FPGA remains the same physical device even as its configuration changes.

Human growth is more complicated than that, but the metaphor still gives me hope.

We are not required to remain exactly as we were yesterday.

And perhaps the most beautiful thing about being human is that we can continue becoming better without having to erase every part of who we have been.

कुछ सवाल उम्र भर जवाब नहीं माँगते,
कुछ रिश्ते हर बार अपना नाम नहीं माँगते।
जो बदल दे तुम्हारी सोच का पूरा नज़रिया,
वो लम्हे किसी आख़िरी अंजाम के मोहताज नहीं रहते।

I began this journey with a blinking LED.

Today, I work with digital architectures, cryptographic accelerators, and the challenges of building efficient hardware.

Yet the fundamental excitement remains the same: the possibility of turning an idea into something real.

And somewhere in that journey, I learned that life is not merely about reaching a final, perfect version of ourselves.

It is about remaining curious enough to question who we are, courageous enough to change when change is necessary, and wise enough to preserve what truly matters.

So, to silicon, to patience, to every failed implementation, to every lesson hidden inside a difficult problem, and to the people whose questions stay with us long after the conversation ends:

Program. Play. Repeat. ❤️

And if life ever refuses to behave the way you expected, do not assume that your story is over.

Perhaps you have simply discovered something that needs to be understood before the next configuration can begin.

Because sometimes, the most important thing you will ever design is not a circuit. It is the person you are still becoming.

- Sahil Maurya
Research Scholar | School of Computing and Electrical Engineering | IIT Mandi
`;
