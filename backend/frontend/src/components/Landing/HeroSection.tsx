import React, { useMemo } from 'react'
import { Badge } from '../ui/badge'
import { ArrowRight, CheckCircle2, Database, Globe2, LockKeyhole, PencilLine, Puzzle, Rocket, ServerCog, ShieldHalf, Sparkles, Users2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'

// ---- Mock helpers
const tenants = [
    { name: "Acme Media", sub: "acme" },
    { name: "BlueWave", sub: "blue" },
    { name: "InstaDev", sub: "insta" },
  ];


const features = [
    {
      icon: <Rocket className="h-5 w-5" />, title: "Blazing Fast",
      desc: "SSR-ready, CDN-optimized and image-smart for peak Core Web Vitals."
    },
    {
      icon: <ShieldHalf className="h-5 w-5" />, title: "Enterprise Security",
      desc: "Per-tenant isolation, role-based access, SSO and audit trails."
    },
    {
      icon: <Puzzle className="h-5 w-5" />, title: "Composable",
      desc: "Bring your own components, themes and content pipelines."
    },
    {
      icon: <Globe2 className="h-5 w-5" />, title: "Multi-Region",
      desc: "Deploy close to your readers with seamless failover."
    },
  ];
  const plans = [
    {
      name: "Starter",
      price: "₹0",
      tagline: "For personal blogs & pilots",
      points: ["1 tenant", "Up to 3 authors", "Custom domain", "Basic analytics"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Growth",
      price: "₹2,999",
      tagline: "For teams scaling content",
      points: ["Up to 5 tenants", "SAML/SSO", "Advanced roles", "Scheduler & drafts"],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      tagline: "Security & compliance first",
      points: ["Unlimited tenants", "VPC / IP allowlist", "Audit logs", "99.9% uptime SLA"],
      cta: "Talk to Sales",
      popular: false,
    },
  ];
  
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Head of Marketing, Acme",
      text: "We launched 3 microsites in a week. Multi-tenant setup + role control = chef's kiss.",
    },
    {
      name: "Arun Singh",
      role: "CTO, BlueWave",
      text: "Separation of data per tenant and SSO out-of-the-box saved us months.",
    },
  ];
  
  const posts = [
    { title: "Designing Tenant Isolation in Postgres", tag: "Architecture" },
    { title: "Shadcn UI Patterns for Content Apps", tag: "Frontend" },
    { title: "CI/CD for Multi-Region Deployments", tag: "DevOps" },
  ];
const HeroSection = () => {

    const hostInfo = useMemo(() => {
        if (typeof window === "undefined")
          return { sub: "", root: "http://localhost:5173" };
        const host = window.location.host; // e.g. acme.yourapp.com or yourapp.com
        const parts = host.split(".");
        if (parts.length > 2)
          return { sub: parts[0], root: parts.slice(1).join(".") };
        return { sub: "", root: host };
      }, []);
    

  return (
   <div>
     <section className='relative overflow-hidden border-b'>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
            <div className="flex flex-col justify-center gap-6">
                <Badge variant={'outline'} className='w-fit'>
                    <LockKeyhole className='h-3.5 w-3.5 mr-1' />
                </Badge>
                <motion.h1
                initial={{opacity:0, y:10}}
                animate={{opacity:1, y:0}}
                transition={{duration:0.5}}
                className='text-4xl font-bold tracking-tight sm:text-5xl'
                >
                    One codebase. Infinite tenants. Stunning content.
                </motion.h1>
                <p className="text-lg text-muted-foreground">
                Launch branded blogs for every business unit or client—each with isolated data, custom themes, and role-based access.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size={'lg'} className='group'>
                        Create your first tenant
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button size="lg" variant="outline">Book a demo</Button>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> SSO & RBAC</div>
              <div className="flex items-center gap-2"><ServerCog className="h-4 w-4 text-primary" /> Region failover</div>
              <div className="flex items-center gap-2"><Database className="h-4 w-4 text-primary" /> Postgres/Prisma ready</div>
            </div>
            </div>

            <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative">
                <Card className='relative overflow-hidden border-2'>
                    <CardHeader className='pb-2'>
                        <CardTitle className='flex items-center justify-between text-base'>
                        <span className="flex items-center gap-2 text-muted-foreground"><Users2 className="h-4 w-4" /> Tenants</span>
                        <Badge variant="secondary">{hostInfo.sub || "No tenant selected"}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                        {tenants.map((t) => (
                    <div key={t.sub} className="rounded-2xl border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium">{t.name}</div>
                        <Badge>{t.sub}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Isolated content space with its own authors, theme, and analytics.</p>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" onClick={() => (window.location.href = `https://${t.sub}.${hostInfo.root}`)}>Open</Button>
                        <Button size="sm" variant="outline">Settings</Button>
                      </div>
                    </div>
                  ))}
                        </div>
                    </CardContent>
                </Card>
            {/* decorative glow */}
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] bg-gradient-to-tr from-primary/10 via-transparent to-primary/10 blur-2xl" />
          </motion.div>
        </div>
    </section>

      {/* Logos / Social proof */}
      <section className="border-b">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-8 text-sm text-muted-foreground md:py-10">
          <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Trusted by product & content teams</span>
          <span>•</span>
          <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4" /> Data isolated per tenant</span>
          <span>•</span>
          <span className="inline-flex items-center gap-2"><PencilLine className="h-4 w-4" /> Beautiful editor experience</span>
        </div>
      </section>

        {/* Features */}
        <section id="features" className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Built for scale, designed for teams</h2>
            <p className="mt-3 text-muted-foreground">Isolation, security, and speed—without compromising on editorial joy.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title} className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">{f.icon}</span>
                    {f.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
       {/* CTA / newsletter */}
       <section className="border-b">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-14 md:grid-cols-[1.2fr_.8fr]">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Spin up a tenant in minutes</h3>
            <p className="mt-2 text-muted-foreground">Point your domain, invite your team, and start publishing. No infra headaches.</p>
            <div className="mt-5 flex gap-2">
              <Input placeholder="Enter work email" className="h-11 max-w-sm" />
              <Button className="h-11">Request access</Button>
            </div>
          </div>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">What you get</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Custom themes per tenant</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> RBAC: Admin, Editor, Author, Viewer</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Audit logs & webhooks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> REST & GraphQL APIs</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple pricing for every stage</h2>
            <p className="mt-2 text-muted-foreground">Start free, move up as your teams and tenants grow.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={cn("relative rounded-2xl", plan.popular && "border-primary")}> 
                {plan.popular && (
                  <Badge className="absolute right-3 top-3" variant="default">Most popular</Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="mt-1 text-3xl font-bold">{plan.price}<span className="ml-1 text-base font-medium text-muted-foreground">/mo</span></div>
                  <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                </CardHeader>
                <CardContent>
                  <ul className="mb-5 grid gap-2 text-sm">
                    {plan.points.map((p) => (
                      <li className="flex items-center gap-2" key={p}><CheckCircle2 className="h-4 w-4 text-primary" /> {p}</li>
                    ))}
                  </ul>
                  <Button className="w-full">{plan.cta}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section id="blog" className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">From the blog</h3>
              <p className="mt-1 text-sm text-muted-foreground">Engineering notes and product updates.</p>
            </div>
            <Button variant="ghost">View all</Button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Card key={p.title} className="rounded-2xl">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">{p.tag}</Badge>
                  <CardTitle className="mt-2 text-lg leading-tight">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Read how we built and secured our multi-tenant architecture with DX in mind.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Teams ❤️ our editor & control</h3>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <Card key={t.name} className="rounded-2xl">
                <CardContent className="pt-6">
                  <p className="text-base">“{t.text}”</p>
                  <div className="mt-4 text-sm text-muted-foreground">{t.name} • {t.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">FAQ</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">How do you isolate tenants?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                We support schema-per-tenant or row-level security in Postgres, plus per-tenant object storage buckets.
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Can we bring SSO?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Yes—SAML, OAuth, and SCIM are supported on Growth and Enterprise plans.
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Is there a headless API?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                REST & GraphQL endpoints let you push/pull content and automate workflows.
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Where do you host?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Deploy on your cloud or ours; multi-region support with CDN and image optimization.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
   </div>
  )
}

export default HeroSection
