# Voice sample: Chris's own writing (calibration target)

This is the canonical voice-calibration sample referenced by H7 in
`.claude/skills/humanizer/SKILL.md`. Every humanizer pass on full-treatment
content (blog posts, roundups, spotlights) calibrates against this text.

Provenance: published as a guest-post collaboration with ThePoorSwiss (2026),
but written entirely by Chris; the co-byline was a courtesy credit. Every
sentence here is his, so the whole text is fair ground for calibration.
Extracted, rule-level findings live in V11 of the humanizer skill; this file
is the raw reference.

Note for calibration, not imitation of substance: the sample uses a couple as
its worked example because that post modeled two-adult costs. PortfolioAtlas
site prose stays household-agnostic per the standing content rules; borrow the
*techniques* (worked example, direct address, data delivery), not the
household framing.

---

## The Swiss FIRE Paradox

Strong incomes in Switzerland should compress the accumulation phase of achieving FIRE, however due to high cost of living expenses, Switzerland's FIRE-chasers are still the furthest from the finish line.

With highly competitive Swiss incomes comes inflated spending targets. A lean but comfortable life in Switzerland can cost a couple at least CHF 52,600 ($65,100 USD), but commonly much more. This is the Swiss FIRE paradox: making more won't always get you closer to FIRE than any other European country unless we consider geoarbitrage.

A dual-income Zurich couple at the regional median income is CHF 180,000 ($223,000 USD). This income bests most European countries, however it comes with a Zurich price tag for a couple to comfortably FIRE of CHF 2.45M ($3.04M USD). Even with aggressive savings rates, this makes FIRE within Switzerland extremely challenging.

Below is a breakdown of savings rates needed to FIRE in Switzerland. Taking our Zurich couple from above, their annual savings rates must be the numbers below in order to hit their FIRE goals by certain age-milestones.

- Retiring at 40 in Zurich means saving CHF 113,600 every year or 63% of pre-tax income.
- Retiring at 50 in Zurich means saving CHF 51,300 every year or 29% of pre-tax income.
- Retiring at 60 in Zurich means saving CHF 27,100 every year or 15% of pre-tax income.

Saving CHF 113,600 a year requires banking nearly 2/3rds of your income, which exceeds most couple's abilities when factoring in Swiss taxes, required insurance, and rent. Even retiring by your 50s means over a quarter of all paychecks must be stowed away - also a challenging feat with the high Swiss taxes and daily life expenses.

Comparing this to neighboring countries, you can live the same lifestyle for less than half that net worth when willing to FIRE outside of Switzerland, but first let's cover our methodology.

## Methodology

Let's take a look at where these numbers come from: CHF 2.45M to retire in Switzerland. Leveraging the 4% rule this gives our couple CHF 8,166 each month to cover their expenses.

Our dataset is in USD, converted at USD/CHF 0.8075 as of July 17, 2026, re-run at today's rate.

What's a lifestyle like at this price point? They live in a one-bedroom apartment within walking distance of the lake. They eat out multiple times a week and enjoy monthly comedy shows and nightlife. Their budget allows several weekend ski trips in the winter still with supplemental passive income to cover taxis - they don't have a car and they don't need one. This is a comfortable lifestyle in a city with a high quality of life.

Our couple is not living a lean lifestyle, but they're also not close to topping what Zurich has to offer. CHF 8,166 monthly translates to CHF 98,000 annually, which when following the Trinity study's 4% rule, we multiply this by 25 (the conventional "safe" withdrawal rate) and land at CHF 2.45M required to fund their life.

However the 4% rule deserves less trust than many early retirees give it. It's from the Trinity study that is based on 30 year retirements. For those looking to retire early, we might be looking at 40 year or 50 year retirements. This is where the 4% rule can break down.

Rather than rely exclusively on the 4% rule, we backtested this data against historical rolling markets from the past 150 years (from 1871 to 2022) factoring in inflation with a 75%/25% stock/bond portfolio rebalanced annually.

Back to our couple... At 30 years of retirement, withdrawing 4% of their portfolio to retire comfortably in Zurich succeeds 96.7% of the time, failing in 3.3% of real historical scenarios.

Quick aside - what is failure here? Failure means our couple ran out of money while they were alive. This matches our 4% rule closely. What if our couple retires with 50 years to spare? Our historical backtest on real stock market growth shows they succeed in 83.5% of scenarios, failing 16.5% of the time. 1 retirement out of 6 runs out of funds while our couple is still alive even while they follow the 4% rule.

At 3% withdrawal rates, every stock market scenario from the past 150 years resulted in our couple never running out of money for 50 years of retirement.

This isn't meant to scare folks into over-saving. In fact, with flexible spending habits, couples can overcome many of the challenges revealed in historical backtests, but our methodology serves to showcase how assumptions should examine real data before making life-changing decisions.

Now, to cover some mechanical details of our analysis… We're assuming a couple, not an individual. Expenses do not scale linearly from one person to two and we scale each expense discretely - groceries increase at different rates from rent and rent scales differently from insurance.

What if there were another path to derisk our couple's early retirement? Below we share what geoarbitrage has to offer our Swiss couple.

## Staying Close

FIREing in Zurich is an expensive decision but feeling away from home is where the real problems can manifest. What options does one have when they don't want to work until they're 65 but also don't want to be so far from home? Here we'll examine alternatives that afford a much earlier retirement than Zurich without feeling like we traveled halfway across the world.

Lisbon is a three hour flight from Zurich. Valencia is two. Spain shares Switzerland's timezones and Portugal is only one hour behind - calling your mum requires no more planning than it does when she lives across town. You can make the ad hoc weekend dinner with just a day's heads up.

What your money does for you in Zurich does much more when you look outside the country, but still nearby. Lisbon costs you CHF 3,370/month, CHF 2,860 for Porto, and CHF 2,690 for Valencia all for a similar quality of life.

How? The category lines make it pretty clear. Housing costs in Lisbon are only CHF 1,680 for a similar setup as Zurich. Healthcare drops substantially from CHF 1,195 to CHF 258 in Iberia as nothing out there matches the Swiss KVG premium. At this same FIRE tier you get a nice central flat, frequent dining out, and great healthcare.

The same comfortable retirement in Zurich comes with a price tag of CHF 98,000 annually or CHF 2.45M. Looking at nearby countries it drops substantially for our couple.

- Lisbon FIRE needs CHF 1.01M
- Porto FIRE needs CHF 858k
- Valencia FIRE needs CHF 807k

If our couple saves up CHF 2.45M working in Zurich, they could retire at withdrawal rates of 1.7% (Lisbon), 1.4% (Porto), or 1.3% (Valencia). Even 2% never failed in the past 150 years of data and this is lower than that.

For our couple, they're comfortable calling their folks an hour later and taking an extra day to plan a flight for Saturday night dinner with their Zurich friends. What does this geoarbitrage flexibility mean for them? Years of early retirement coming back to them.

This couple started from CHF 0 at 25 years old and aggressively saved 29% of their Zurich average couple income for 25 years. They can retire in Zurich safely by 50.

- Retiring in Lisbon gets them 10.9 years back
- Retiring in Porto gets them 12.5 years back
- Retiring in Valencia gets them 13.1 years back

Already have money saved up? You're farther ahead than our couple and can extrapolate your own timelines, speed running our couple's FIRE journey.

This isn't an ad for Lisbon, Porto, or Valencia either. There are many cities like these surrounding Switzerland with significantly lower price tags for similar FIRE lifestyles. We encourage you to research what lifestyle works best for you beyond these three examples.

## Going Farther

The previous section was your life away from home, without feeling like it. This is your life away from home, and you can tell.

If you want family nearby, staying close makes sense. But what if you're comfortable being anywhere in the world for those extra years of freedom?

Chiang Mai, Da Nang, and Medellin practically sit on the other side of the world from Zurich. It's a 13 hour flight from Vietnam or Thailand back home to Zurich and your timezones will be 5 - 7 hours off from anyone back home. Saturday night dinners become part of your big trips once or twice a year and are no longer a weekend whim.

The monetary value you get back is the real tradeoff for this distance. Monthly expenses for similar qualities of life in these 3 cities are below:

- Chiang Mai costs CHF 2,262/month
- Da Nang costs CHF 2,408/month
- Medellin costs CHF 2,516/month

These costs are lower due to similar reasons as Iberia, but even louder. Housing costs are CHF 651/month and good private healthcare is about CHF 299/month in Chiang Mai. Withdrawal rates for our couple that waits until they have CHF 2.45M are 1.1% and 1.2% now. Every historical backtest suggests they will die with significantly more money than they started with.

- Retiring in Medellin gets them 13.7 years back
- Retiring in Da Nang gets them 14.1 years back
- Retiring in Chiang Mai gets them 14.6 years back

There's a quiet lesson here. Retiring in Chiang Mai only gets about an extra year or two back, but costs you living across the world. Going farther won't shave substantial years off your FIRE journey, but what it will do is give significantly higher confidence margins with your decision.

When traveling to Thailand and Vietnam, there are real visa issues to consider beyond the numbers. Thailand has a 10 year LTR visa requiring you to be 50 or older with 80,000 income. Young retirees have more hurdles. Vietnam has no retirement visa meaning you'll have to balance shorter stays. Colombia is very friendly now, but visa requirements change frequently. It's important to do your own research into the logistical work that comes with moving countries.

Like earlier, this isn't an ad for these 3 cities. They're a few data points on a much bigger curve that includes dozens of cities with similar lifestyles and price tags. The right one for you may depend on more than just your withdrawal rate.

## The Swiss Twist

So far we've only talked about the raw numbers that go hand-in-hand with FIRE. What we haven't touched on is what it means to actually leave Switzerland, which is a bit more overhead than simply booking a one-way flight.

Many Swiss expatriates forget they have their second pillar - the occupational pension - but only if they retire under specific conditions. Moving to an EU or EFTA country and the mandatory part of your pension remains in a Swiss account until you're of retirement age - then it becomes accessible to you. However should you move outside these European countries and your entire pension is available for you to immediately withdraw. In a poetic asymmetry, moving farther away from home to cheaper non-EU/EFTA countries yields more money now for you to leverage in your younger FIRE years.

Nothing is certain in life but death and taxes. Your pension withdrawal is taxed, however the taxes are dependent on the canton in which your money sits - notably not necessarily where you last lived. Before deregistering to FIRE outside of Switzerland, people can move money to lower tax cantons before withdrawals and often execute common tax strategies like splitting withdrawals over multiple years.

Take a look at our couple as an example. Say they have CHF 600,000 sitting in their pension fund when they choose to move to Chiang Mai. With their foundation seated in Zurich they're paying CHF 49,100 in taxes. If they file the paperwork to transfer their foundation to Schwyz then they're paying CHF 27,800 in taxes - CHF 21,300 saved for strategically filed paperwork.

With the third pillar, some of the departure math works in your favor. Once you deregister, your 3a account unlocks and your canton wealth tax ends. Switzerland charges no exit tax on your portfolio either. For the first 1M invested, you're paying about CHF 1,744 annually until you file to deregister.

When you deregister your KVG ends, however you may need to buy into a new plan. Healthcare costs are covered in our analysis, but treat that as directional - individual circumstances cause variances in what you pay for coverage. Additionally, you take on risk of exchange rates. Although CHF is traditionally a safe, strong currency to own, many find holding a year or two in the local currency comes with stabilizing benefits. This is not financial advice, more things to think about as we consider geoarbitrage beyond Switzerland.

Your new country may tax the payout too; this is dependent on the current treaties in place. Tax rates also change including Schwyz cutting taxes in 2026, so take the section more as a directional guide and less of hard numbers that will remain precise forever.

This is the time where two hours with a financial expert can pay for itself ten times over as you enter your FIRE journey.

## Should I Stay?

You've heard five data-centric sections arguing why you might want to leave. An equally important question to ask yourself is if it's worth it…

The healthcare you're paying CHF 1,195 for in Switzerland is world class. You'll notice this is hard to rival anywhere else you move to. Your friends are a short bike ride away. Hop on the train and you're at your parents house for dinner. Moving away usually means giving this up and starting many of your relationships over.

Moving back to Switzerland after deregistering is not automatic for everyone. There are many hoops to jump through should you want to come back including restarting your KVG. By staying in Switzerland, you never close the door on returning home. When you leave, a few doors close behind you.

Our research shows that you don't have to leave Switzerland to FIRE early. Our couple can retire in Lugano with CHF 356k less than Zurich - or around CHF 2.1M. You stay with your KVG system, you keep your pension, and your family in Zurich is a two-hour train ride away.

There's another FIRE path to consider that blends parts of both worlds. You can spend 5 months in Zurich with your friends and family and 7 in Valencia. This comes with a blended cost of CHF 59,700 (opposed to CHF 98,000 staying in Zurich) putting your FIRE number closer to CHF 1.49M, cutting 6.5 years off your working FIRE journey. Now, mind the fine print. Spend more than 183 days in Spain and you accidentally trigger Spanish residency. You also keep paying your Swiss wealth tax.

FIRE doesn't have to be black and white, but every degree you turn the dial comes with a cost. What happens when a parent gets sick and you're a 13 hour flight away in Chiang Mai? That's categorically harder than a 3 hour flight. Data can help us price the options, but it can't tell your gut what works best for you while not all decisions need to be purely about the numbers.

## Decision Framework

If you're still reading, you can tell there is no one-size fits all approach. What we can do is provide a decision framework that might help you find the best path forward.

Distance. Decide how close you need to be to your loved ones. For some, a last minute flight back home is sufficient coverage. For others, one to two flights a year will be fine. The answer to this most heavily shapes if you follow our hypothetical couple to Iberia or open the entire map up to find your new FIRE life. Not sure? A year of travel can help you discover what's best without needing to make a full commitment yet.

EU/EFTA or not? There are big tax differences to your pension with this decision. Inside this region that mandatory part of your pension stays locked within Switzerland until you are at retirement age. Branch outside and it's yours immediately.

Paperwork. Traveling amongst the EU countries is trivial with Swiss citizenship. Moving to Thailand comes with frequent visa renewals. If your version of FIRE doesn't include recurring paperwork through your retirement, the set of destinations for you shrinks.

Money. This is where our geoarbitrage journey began, but we consider it the least important factor of the four on this decision tree. 3% withdrawal rates have never failed in 150 years of market returns. Going to 3.5% and you accept there is some risk in extreme series of events - historical data proves that 3.5% would not be enough in several 50 year periods. And then there's the cheaper FIRE cities with good infrastructure like Chiang Mai. Our couple could retire here with only 1.1% withdrawal rates, with triple the defensive margin needed and a long flight home.

The FIRE optionality of cities explored today is the point. The Swiss FIRE paradox is a menu, not a trap. The CHF 2.45M question isn't "can we afford Zurich." It's "what is Zurich worth to us." You now have every number you need to answer it. The only input missing is yours.

---

# Exhibit B: Chris's line-edit of a draft intro (2026-08-16)

A second calibration source: Chris rewrote a pipeline draft's intro in his own
voice. The pair below shows exactly what he changes. Rule-level findings are
in V11 items 12-17 of the humanizer skill.

DATA WARNING (H1): Chris's rewrite contains figure drift introduced during the
style edit ("123 years from 1871 to 2025"; the engine's actual numbers are 123
START years, retirement windows starting 1871-1993, dataset through 2022).
Calibrate on the VOICE only. Figures always come from the engine and the locked
data file, never from this exhibit.

**Pipeline draft (before):**

> Take $1,000,000, put it 75/25 into stocks and bonds, and retire on it for 30 years. Now hold everything fixed except two inputs: the year you stop working and what your city costs each month. We ran that exact experiment through the same backtest engine behind every verdict on the site, across 123 start years from 1871 to 1993 and the FIRE-tier cost of living in all 127 PortfolioAtlas cities. Depending on your two inputs, the same plan ends anywhere from broke in 6 years to an estate larger than the portfolio that funded it.
>
> The model holds the market constant: US returns and US CPI apply everywhere, and the city sets only the spending level, so "retiring in Singapore in 1966" means the 1966 market sequence at today's Singapore prices. The full methodology is at the end.
>
> The worst year in that record isn't the one you'd guess.

**Chris's rewrite (after):**

> Let's say you have $1,000,000 and put it in a standard 75/25 split of stocks and bonds for a 30 year retirement. We'll assume all variables are held constant except two: 1) the year you stop working and 2) where you retire. At PortfolioAtlas we ran that experiment with our own backtest engine through historical stock market data - spanning 123 years from 1871 to 2025 and calculated the FIRE-tier cost of living in all of our cities. Those two inputs alone determine whether you end up broke after 30 years or with multiples on your wealth.
>
> Our model keeps the market constant wherever you are in the world, so retiring in Singapore in 1966 means the 1966 market sequence but at today's Singapore prices. We cover PortfolioAtlas' methodology at the end.
>
> Wondering the worst year to retire? It's probably not the one you expect.
