import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LinkIcon,
  BarChart3,
  Zap,
  Globe,
  Shield,
  ArrowRight,
  Check,
  Star,
  MousePointerClick,
  QrCode,
  Clock,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Zap,
    title: "Instant Shortening",
    description:
      "Paste a long URL and get a clean, shareable link in milliseconds — no signup required to try.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description:
      "Track every click with a real-time dashboard. See where your audience comes from and what device they use.",
  },
  {
    icon: QrCode,
    title: "QR Code Ready",
    description:
      "Every shortened link comes with a ready-to-download QR code, perfect for print and offline campaigns.",
  },
  {
    icon: Globe,
    title: "Custom Slugs",
    description:
      "Choose a memorable alias instead of a random code — your brand stays front and center in every link.",
  },
  {
    icon: Clock,
    title: "Link Expiry",
    description:
      "Set an expiration date on any link. Great for limited-time promotions and time-sensitive content.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "All links are served over HTTPS. 99.9% uptime guarantee so your links are always reachable.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal use and testing.",
    features: [
      "50 links per month",
      "Basic click analytics",
      "QR code generation",
      "Link expiry",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/ month",
    description: "For creators, marketers, and small teams.",
    features: [
      "Unlimited links",
      "Advanced analytics dashboard",
      "Custom slugs",
      "Link expiry controls",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/ month",
    description: "Collaborate and scale across your whole team.",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Shared analytics",
      "API access",
      "SSO & audit logs",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

const testimonials = [
  {
    name: "Sofia M.",
    role: "Content Creator",
    initials: "SM",
    quote:
      "Linkly replaced three tools at once. The analytics alone are worth it — I finally know what content my audience actually clicks on.",
  },
  {
    name: "James T.",
    role: "Growth Marketer",
    initials: "JT",
    quote:
      "Custom slugs and expiry dates are game-changers for campaign links. Setup took under a minute and it just works.",
  },
  {
    name: "Priya K.",
    role: "Startup Founder",
    initials: "PK",
    quote:
      "We migrated our entire link infrastructure to Linkly in an afternoon. The API is clean and the dashboard is beautiful.",
  },
];

const stats = [
  { label: "Links shortened", value: "4.2M+" },
  { label: "Clicks tracked", value: "180M+" },
  { label: "Active users", value: "12K+" },
  { label: "Uptime", value: "99.9%" },
];

// ─── Sections ─────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <LinkIcon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>Linkly</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="transition-colors hover:text-foreground"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="transition-colors hover:text-foreground"
          >
            Testimonials
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">
              Get started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 text-center">
      {/* Glow blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--primary)" }}
      />

      <div className="mx-auto max-w-3xl">
        <Badge
          variant="outline"
          className="mb-6 gap-1.5 px-3 py-1 text-xs font-medium"
        >
          <MousePointerClick className="h-3 w-3 text-primary" />
          Now with real-time analytics
        </Badge>

        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Short links, <span className="text-primary">big insights</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
          Linkly turns your long, unwieldy URLs into clean, trackable links in
          seconds. Know exactly who clicks, when, and from where.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="/signup">
              Start for free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base"
            asChild
          >
            <Link href="/dashboard">View dashboard</Link>
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required · Free plan always available
        </p>
      </div>

      {/* Floating demo card */}
      <div className="mx-auto mt-16 max-w-lg rounded-2xl border bg-card p-6 shadow-xl text-left">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Try it now
        </p>
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          <LinkIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">
            https://my-very-long-website-url.com/blog/article?utm_source=twitter
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="text-sm font-medium text-primary">
            lnkly.netlify.app/my-article
          </span>
          <Badge variant="outline" className="text-xs">
            <Check className="mr-1 h-3 w-3 text-primary" /> Shortened
          </Badge>
        </div>
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MousePointerClick className="h-3 w-3" /> 142 clicks
          </span>
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" /> 18 countries
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Expires in 7 days
          </span>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl font-bold text-primary">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage links
          </h2>
          <p className="mt-4 text-muted-foreground">
            A focused toolset built for speed. No bloat, no friction.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-muted/30 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free. Upgrade when you're ready.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col transition-shadow hover:shadow-lg ${
                plan.highlighted
                  ? "border-primary shadow-md ring-1 ring-primary/30"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="shadow-sm">Most popular</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {plan.name}
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="mb-1 text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-6">
                <ul className="flex-1 space-y-2.5">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href="/signup">{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by link-makers everywhere
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex flex-col gap-4 p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="flex-1 text-sm text-muted-foreground">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div
          className="rounded-3xl border px-10 py-16 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklch, var(--primary) 8%, transparent), color-mix(in oklch, var(--primary) 4%, transparent))",
          }}
        >
          <Badge variant="outline" className="mb-6">
            Get started today
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Your first short link is
            <br />
            one click away
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of creators and marketers who trust Linkly to manage
            and measure their links.
          </p>
          <Button size="lg" className="h-12 px-10 text-base" asChild>
            <Link href="/signup">
              Create your free account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <LinkIcon className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            Linkly
          </Link>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="hover:text-foreground transition-colors"
            >
              Testimonials
            </a>
            <Link
              href="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Linkly. All rights reserved.
          </p>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-xs text-muted-foreground">
          Built with Next.js · Hosted on Vercel · Secured with HTTPS
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
