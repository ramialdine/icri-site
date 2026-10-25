export const metadata = {
  title: "Privacy Policy | Islamic Center of Rhode Island",
  description:
    "How the Islamic Center of Rhode Island handles information on its website and WhatsApp update tool.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="text-sm opacity-70">Last updated: October 24, 2026</p>

      <p>
        This policy explains what information the Islamic Center of Rhode Island
        (&ldquo;ICRI,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) handles through
        our website, https://masjid-alkareem.org, and the WhatsApp update tool our
        staff use to post announcements and events. We keep it short because we
        collect very little.
      </p>

      <h2 className="text-xl font-semibold">Visitors to the website</h2>
      <p>
        You can read the site without giving us any personal information. Our
        hosting provider (Vercel) keeps standard server logs, such as IP address,
        browser type and the pages requested, to run and secure the site. We do
        not sell this information or use it for advertising.
      </p>

      <h2 className="text-xl font-semibold">WhatsApp update tool (staff only)</h2>
      <p>
        A small number of approved ICRI staff and volunteers can send a WhatsApp
        message to our business number to draft a website update, such as an
        announcement or an event. The tool is not open to the public and does not
        message members of the public.
      </p>
      <p>When an approved person sends a message, we receive:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>their WhatsApp phone number, which we check against our approved list;</li>
        <li>the text, and any flyer image, they send; and</li>
        <li>delivery details such as the time the message was sent.</li>
      </ul>
      <p>We use this only to prepare a draft update for the website. A designated
        approver reviews every draft on WhatsApp before anything is published.
        Messages from numbers that are not on the approved list are ignored.</p>

      <h2 className="text-xl font-semibold">Services that process this information</h2>
      <p>To run the tool, message content passes through these providers:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Meta (WhatsApp Business Platform), which delivers the messages;</li>
        <li>Anthropic, which processes the message text or flyer image to turn it into a draft;</li>
        <li>Sanity, where drafts and published website content are stored; and</li>
        <li>Vercel, which hosts the website and the tool&apos;s server.</li>
      </ul>
      <p>
        Each provider handles data under its own terms and privacy policy. We do
        not sell personal information or share it for advertising.
      </p>

      <h2 className="text-xl font-semibold">How long we keep it</h2>
      <p>
        Published announcements and events stay on the website until we remove
        them. Draft content that is rejected or abandoned is deleted from our
        content system. Staff phone numbers stay on the approved list only while
        the person is authorized to post.
      </p>

      <h2 className="text-xl font-semibold">Your choices</h2>
      <p>
        If you are an approved sender and want your number removed, or you want
        to ask what we hold about you, contact us using the details below and we
        will respond promptly.
      </p>

      <h2 className="text-xl font-semibold">Children</h2>
      <p>
        Our website and update tool are not directed at children under 13, and we
        do not knowingly collect their personal information.
      </p>

      <h2 className="text-xl font-semibold">Changes to this policy</h2>
      <p>
        If we change how we handle information, we will update this page and the
        date above.
      </p>

      <h2 className="text-xl font-semibold">Contact</h2>
      <p>
        Masjid Al Kareem, Islamic Center of Rhode Island
        <br />
        39 Haskins St, Providence, RI 02903
        <br />
        Phone: (401) 274-3986
      </p>
    </article>
  );
}
