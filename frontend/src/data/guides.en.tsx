/* eslint-disable react-refresh/only-export-components -- guide bodies sit next to the catalogue */
import { CABLE_TABLE } from '../lib/calc'
import { useFormat } from '../lib/format'
import { Link } from '../lib/router'
import { NL_IRRADIATION, PERFORMANCE_RATIO } from '../lib/solar'
import { monthNames } from '../i18n/months'
import { IMAGES, type ImageCredit } from './images'
import type { Guide } from './guides'

const cta = (href: string, label: string) => ({ href, label })

function UseBody() {
  return (
    <>
      <p>
        Every battery or solar calculation starts with one number: how much energy do you use in a day? That is watt-hours
        (Wh). A 40 watt appliance left on for 12 hours uses 480 Wh.
      </p>
      <h2>The formula</h2>
      <p className="formula">daily use (Wh) = power (W) × hours per day</p>
      <p>
        Add that up for every appliance and you have your daily use. A couple with a fridge, lights, phones, a water pump
        and a laptop usually lands between 600 and 900 Wh.
      </p>
      <h2>Three traps</h2>
      <h3>1. The fridge does not run all the time</h3>
      <p>
        A compressor fridge draws 40 to 60 W while the compressor is on, then switches off. On average that is 30 to 50%
        of the time, more in summer. Count about 12 hours a day, not 24.
      </p>
      <h3>2. 230 volts costs extra</h3>
      <p>
        Anything that uses a wall socket goes through an inverter. The inverter loses about 10 to 15%. A 60 W laptop on
        230 V therefore costs the battery about 68 W. Charge the laptop from a 12 V adapter and you skip that loss.
      </p>
      <h3>3. Short and heavy still counts</h3>
      <p>
        A 1000 W coffee machine uses 150 Wh in nine minutes. That is not much energy, but the power decides how large the
        inverter and the cables have to be.
      </p>
      <h2>Measuring beats guessing</h2>
      <p>
        Already have a system? A battery monitor with a shunt shows exactly what you use in a day. Measure a few ordinary
        days and put that number into the configurator.
      </p>
    </>
  )
}

function SolarBody() {
  const { fmt, num } = useFormat()
  const months = monthNames('en')
  return (
    <>
      <p>
        You will often read that 100 Wp produces about 400 Wh a day. In summer that is roughly right. In March and October
        you get half of that, and in December about a tenth.
      </p>
      <h2>Yield per 100 Wp, flat on the roof</h2>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Irradiation (kWh/m² per day)</th>
              <th scope="col">Yield per 100 Wp</th>
            </tr>
          </thead>
          <tbody>
            {NL_IRRADIATION.map((h, i) => (
              <tr key={i}>
                <th scope="row">{months.long[i]}</th>
                <td className="num">{num(h)}</td>
                <td className="num">{fmt(100 * h * PERFORMANCE_RATIO)} Wh</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted small">
        Irradiation: PVGIS, De Bilt in the Netherlands, average 2013–2020. Yield includes a {fmt(PERFORMANCE_RATIO * 100)}%
        system efficiency for heat, dirt, shade and cables. A choice of solar region is not in yet, so these are not
        figures for Scandinavia or southern Europe.
      </p>
      <h2>Design for your darkest travel month</h2>
      <p>
        Travelling from April to September? September decides how much panel you need, not July. In summer you then have
        a surplus, and that is fine.
      </p>
      <p className="formula">panel (Wp) = daily use ÷ (irradiation × {num(PERFORMANCE_RATIO)})</p>
      <h2>Will it fit on the roof?</h2>
      <p>
        A 100 Wp panel is about 1 × 0.55 m. A campervan usually fits 200 to 300 Wp, a semi-integrated motorhome 400 to
        600 Wp. Short of space? The DC-DC charger makes up the difference while you drive.
      </p>
      <h2>Rigid or flexible?</h2>
      <p>
        Rigid panels on a frame stay cooler, so they produce more and last longer. Flexible panels are light and discreet,
        but they run hot when they are glued straight onto the roof.
      </p>
    </>
  )
}

function BatteryBody() {
  return (
    <>
      <p>
        Most campers built before 2020 have an AGM or gel battery. More and more owners replace it with lithium iron
        phosphate: LiFePO4. That is the safer lithium chemistry, not the one in your phone.
      </p>
      <h2>The difference in one table</h2>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">AGM, 100 Ah</th>
              <th scope="col">LiFePO4, 100 Ah</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Usable</th>
              <td>about 50 Ah</td>
              <td>about 90 Ah</td>
            </tr>
            <tr>
              <th scope="row">Weight</th>
              <td>about 28 kg</td>
              <td>about 12 kg</td>
            </tr>
            <tr>
              <th scope="row">Charge cycles</th>
              <td>300–600</td>
              <td>2,000–6,000</td>
            </tr>
            <tr>
              <th scope="row">Voltage under load</th>
              <td>falls steadily</td>
              <td>stays flat</td>
            </tr>
            <tr>
              <th scope="row">Charging below 0 °C</th>
              <td>fine</td>
              <td>not without a heater</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="muted small">Typical values. Always check the datasheet of the specific battery.</p>
      <h2>When is AGM still the right choice?</h2>
      <p>
        If you mostly stay on campsites with a hook-up and you use little, a good AGM battery is cheaper and you do not
        have to change the chargers.
      </p>
      <h2>Watch-outs when you switch</h2>
      <ul>
        <li>Never mix lithium and a lead-acid battery in the same bank.</li>
        <li>The chargers need a LiFePO4 profile. Older electroblocks often do not have one.</li>
        <li>Lithium charges so fast it can overload the alternator. A DC-DC charger limits that.</li>
      </ul>
      <p>
        Read on about <Link href="/gidsen/lithium-op-oude-ebl">lithium on an old electroblock</Link> and about the{' '}
        <Link href="/gidsen/dc-dc-lader">DC-DC charger</Link>.
      </p>
    </>
  )
}

function DcdcBody() {
  return (
    <>
      <p>
        Leisure batteries used to sit behind a split-charge relay on the alternator. With lithium that no longer works
        well. A DC-DC charger sits between the starter battery and the leisure battery and charges with the right profile.
      </p>
      <h2>Three reasons to fit one</h2>
      <ol>
        <li>
          <strong>Lithium pulls too much current.</strong> An empty LiFePO4 battery takes whatever the alternator will
          give. The alternator runs hot and fails sooner.
        </li>
        <li>
          <strong>The voltage is too low.</strong> Over a long cable the voltage sags. The lithium battery then never
          reaches full.
        </li>
        <li>
          <strong>Smart alternators.</strong> On Euro 6, usually from 2015, the engine lowers alternator voltage while
          you drive. An ordinary relay then charges almost nothing.
        </li>
      </ol>
      <h2>How large?</h2>
      <p>
        A rule of thumb: about 20 to 30% of the battery capacity. For 100 to 150 Ah, 30 A is enough. From 200 Ah, choose
        50 A. More than 50 A asks too much of most alternators.
      </p>
      <h2>With a smart alternator</h2>
      <p>
        Choose a charger that switches on the engine signal (D+ or ignition), not on voltage alone. Otherwise it switches
        off as soon as the alternator voltage drops.
      </p>
      <h2>Cables</h2>
      <p>
        The cable from the starter battery to the DC-DC charger is often 4 to 6 metres. At 30 A you already need 16 to
        25 mm² to keep the voltage drop under 3%. The <Link href="/configurator">configurator</Link> works it out for
        your lengths.
      </p>
    </>
  )
}

function EblBody() {
  return (
    <>
      <p>
        Many campers have an electroblock (EBL). That is a charger, a fuse box and a split-charge relay in one unit. It
        works well with the lead-acid battery it was designed for. Lithium makes it harder.
      </p>
      <h2>The problem</h2>
      <p>
        A lead-acid battery is charged to about 14.4 V and then held at 13.8 V (float). LiFePO4 wants 14.2 to 14.4 V, and
        then no float at all. Older electroblocks often have no lithium setting. The battery then never fills, or it sits
        under voltage for weeks.
      </p>
      <h2>What you can do</h2>
      <ol>
        <li>
          <strong>Look up the type.</strong> The sticker on the electroblock has the model. Check the manual or the
          maker’s site for a lithium setting or an update.
        </li>
        <li>
          <strong>Switch the internal charger off and add a separate one.</strong> Many owners keep the electroblock for
          the fuses and disable its charger. A separate charger with a LiFePO4 profile takes over.
        </li>
        <li>
          <strong>Replace the alternator charging path.</strong> Swap the relay inside the electroblock for a DC-DC
          charger.
        </li>
      </ol>
      <h2>One more thing</h2>
      <p>
        Some electroblocks use battery voltage to decide whether the engine is running. Lithium sits at a higher resting
        voltage, so that trick sometimes fails. If you are unsure, ask the maker or a camper electrician.
      </p>
    </>
  )
}

function CableBody() {
  const { num } = useFormat()
  return (
    <>
      <p>
        At 12 volts the currents are large. A 2000 W inverter draws nearly 200 A. Every cable has to do two things: carry
        the current without getting hot, and cover the distance without losing too much voltage.
      </p>
      <h2>1. Voltage drop</h2>
      <p>Keep the drop under 3%. At 12.8 V that is about 0.38 V.</p>
      <p className="formula">cross-section (mm²) = 2 × length (m) × current (A) × 0.0175 ÷ allowed drop (V)</p>
      <p>
        The 2 is there because the current goes out and back. Example: 30 A over 5 metres needs 2 × 5 × 30 × 0.0175 ÷
        0.38 = 13.8 mm². You then choose 16 mm².
      </p>
      <h2>2. Current capacity</h2>
      <p>The cable must not run hot either. We use these conservative figures:</p>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Cross-section</th>
              <th scope="col">Continuous maximum</th>
            </tr>
          </thead>
          <tbody>
            {CABLE_TABLE.map((c) => (
              <tr key={c.mm2}>
                <th scope="row">{num(c.mm2)} mm²</th>
                <td className="num">{c.amps} A</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted small">
        Flexible tinned copper with 105 °C insulation, in free air. In a trunking or a bundle the limit is lower.
      </p>
      <h2>3. The fuse matches the cable</h2>
      <p>
        A fuse protects the cable, not the appliance. Choose about 1.25 times the maximum current, and never more than
        the cable can carry. Fit it as close to the battery as you can: ideally within 20 cm.
      </p>
    </>
  )
}

function InstallBody() {
  return (
    <>
      <p>
        A 12 V system feels harmless: it will not shock you. A lithium battery can still deliver thousands of amps in a
        fraction of a second. A loose joint or a short circuit then gets hot enough to start a fire.
      </p>
      <h2>Five rules</h2>
      <ol>
        <li>
          <strong>Every positive cable gets a fuse</strong>, as close to the battery as possible.
        </li>
        <li>
          <strong>A main switch</strong> that disconnects everything in one go.
        </li>
        <li>
          <strong>Crimped lugs</strong> made with the right tool. Do not solder them, and do not just clamp them.
        </li>
        <li>
          <strong>Fix it down.</strong> Batteries and cables must not be able to shift while you drive, or in an
          emergency stop.
        </li>
        <li>
          <strong>The right torque</strong> on battery posts and busbars. Too loose runs hot. Too tight cracks the post.
        </li>
      </ol>
      <h2>When do you call an electrician?</h2>
      <ul>
        <li>From about a 2000 W inverter, or currents above 150 A.</li>
        <li>
          When you change the 230 V shore-power side. Different rules apply there, and you need a residual-current device.
        </li>
        <li>When you are unsure about the electroblock or the maker’s wiring.</li>
      </ul>
      <p>
        Building it yourself? Have the finished job checked before you throw the main switch. Many camper electricians
        do that for a fixed fee.
      </p>
    </>
  )
}

function PowerBody() {
  return (
    <>
      <p>
        A power station is a portable battery with chargers and sockets in one box. A fixed system is separate parts
        mounted in the camper.
      </p>
      <h2>A power station fits when…</h2>
      <ul>
        <li>you use little, up to about 500 Wh a day;</li>
        <li>you do not want to alter the camper, or you rent or lease it;</li>
        <li>you also want the battery at home or in another vehicle.</li>
      </ul>
      <h2>A fixed system is better when…</h2>
      <ul>
        <li>you stay off grid for several days;</li>
        <li>you want a proper charge while driving. A cigarette socket only manages 8 to 10 A;</li>
        <li>you want more than a few hundred watts of solar on the roof;</li>
        <li>you want the existing 12 V kit on one system.</li>
      </ul>
      <h2>A middle way</h2>
      <p>
        Some power stations can be mounted permanently, with their own DC-DC charger and a roof panel. That mixes
        convenience with better charging, but it often costs more than separate parts.
      </p>
    </>
  )
}

function guide(
  slug: string,
  title: string,
  summary: string,
  minutes: number,
  image: ImageCredit | undefined,
  href: string,
  label: string,
  body: Guide['body'],
): Guide {
  return { slug, title, summary, minutes, image, cta: cta(href, label), body }
}

export const GUIDES_EN: Guide[] = [
  guide(
    'verbruik-berekenen',
    'Work out your daily energy use',
    'It all starts with watts times hours. How to estimate it, and where the traps are.',
    4,
    IMAGES.guideUse,
    '/configurator',
    'Calculate your use',
    UseBody,
  ),
  guide(
    'zonnepanelen-op-je-camper',
    'How much solar do you need?',
    'Yield changes by a factor of ten across the year. Size the system for the right month.',
    5,
    IMAGES.guideSolar,
    '/configurator',
    'Calculate your solar',
    SolarBody,
  ),
  guide(
    'lifepo4-of-agm',
    'LiFePO4 or AGM?',
    'Why so many people switch to lithium, and when AGM is still enough.',
    4,
    IMAGES.guideBattery,
    '/lithium-check',
    'Do the lithium check',
    BatteryBody,
  ),
  guide(
    'dc-dc-lader',
    'DC-DC charger: charging while you drive',
    'Why lithium should not hang straight off the alternator, and what a smart alternator changes.',
    4,
    IMAGES.guideDrive,
    '/configurator',
    'Calculate your chargers',
    DcdcBody,
  ),
  guide(
    'lithium-op-oude-ebl',
    'Lithium on an old electroblock',
    'Schaudt, Nordelettronica, CBE: what to check before you connect a lithium battery.',
    5,
    IMAGES.guideOld,
    '/lithium-check',
    'Do the lithium check',
    EblBody,
  ),
  guide(
    'kabels-en-zekeringen',
    'Cables and fuses',
    'Cables that are too thin get hot and waste energy. How to pick the cross-section.',
    5,
    IMAGES.guideCable,
    '/configurator',
    'Calculate your cables',
    CableBody,
  ),
  guide(
    'veilig-installeren',
    'Installing safely',
    'Five rules that prevent a fire, and when to hand the job to an electrician.',
    4,
    IMAGES.guideInstall,
    '/configurator',
    'Size your system',
    InstallBody,
  ),
  guide(
    'powerstation-of-vaste-installatie',
    'Power station or a fixed system?',
    'A power station is easy. A fixed system charges better on the road. How to choose.',
    4,
    IMAGES.guidePower,
    '/powerstation-of-vast',
    'Use the comparison',
    PowerBody,
  ),
]
