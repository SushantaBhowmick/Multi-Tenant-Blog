import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { CheckCircle2 } from 'lucide-react'

const NewsLetter = () => {
  return (
    <section className='border-b'>
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-14 md:grid-cols[1.2fr_.8fr]">
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
  )
}

export default NewsLetter
