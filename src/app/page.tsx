import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LandingNavbar } from '@/components/LandingNavbar';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080?text=Beautiful+Vacation+Scene')] bg-cover bg-center" />
        </div>
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.svg"
                alt="Urlaub Gegen Hand"
                width={300}
                height={75}
                className="dark:invert"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
              Urlaub Gegen Hand
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
              Exchange your skills for unforgettable vacation experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/search">Find Opportunities</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Host Travelers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Create Your Profile
              </h3>
              <p className="text-muted-foreground">
                Sign up and showcase your skills, experience, and what you're
                looking for in an exchange.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Find Perfect Matches
              </h3>
              <p className="text-muted-foreground">
                Browse opportunities or host travelers. Connect with people who
                match your skills and vacation preferences.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Exchange & Enjoy</h3>
              <p className="text-muted-foreground">
                Arrange the details, travel to your destination, and exchange
                your skills for a memorable stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section id="opportunities" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Featured Opportunities
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Discover amazing places where you can exchange your skills for
            accommodation and unique experiences
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://placehold.co/600x400?text=Tuscan+Villa"
                  alt="Tuscan Villa"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Tuscan Villa</h3>
                    <p className="text-muted-foreground">Florence, Italy</p>
                  </div>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                    Gardening
                  </span>
                </div>
                <p className="mb-4">
                  Help maintain our beautiful gardens and enjoy a stay in our
                  historic villa with stunning views of the Tuscan countryside.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/listings/1">View Details</Link>
                </Button>
              </div>
            </Card>

            {/* Card 2 */}
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://placehold.co/600x400?text=Beach+House"
                  alt="Beach House"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Beach House</h3>
                    <p className="text-muted-foreground">Bali, Indonesia</p>
                  </div>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                    Web Design
                  </span>
                </div>
                <p className="mb-4">
                  Help us create a website for our local surf school and stay in
                  our beachfront house with direct access to the ocean.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/listings/2">View Details</Link>
                </Button>
              </div>
            </Card>

            {/* Card 3 */}
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://placehold.co/600x400?text=Mountain+Cabin"
                  alt="Mountain Cabin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Mountain Cabin</h3>
                    <p className="text-muted-foreground">
                      Swiss Alps, Switzerland
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                    Cooking
                  </span>
                </div>
                <p className="mb-4">
                  Cook for our small mountain retreat guests and enjoy free
                  accommodation with breathtaking Alpine views and hiking
                  trails.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/listings/3">View Details</Link>
                </Button>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/search">Explore All Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Success Stories
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Hear from people who have exchanged their skills for unforgettable
            experiences
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <Card className="p-8">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src="https://placehold.co/200x200?text=User"
                    alt="User"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-4 italic text-muted-foreground">
                    "I spent three weeks in Bali helping with website design for
                    a local business. In exchange, I got to stay in a beautiful
                    beachfront property and made friends for life!"
                  </p>
                  <p className="font-semibold">Sarah K.</p>
                  <p className="text-sm text-muted-foreground">
                    Web Designer from Germany
                  </p>
                </div>
              </div>
            </Card>

            {/* Testimonial 2 */}
            <Card className="p-8">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src="https://placehold.co/200x200?text=User"
                    alt="User"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-4 italic text-muted-foreground">
                    "As a host, I've welcomed travelers who helped renovate my
                    cottage in the countryside. The exchange of skills and
                    cultural experiences has been incredibly rewarding."
                  </p>
                  <p className="font-semibold">Marco T.</p>
                  <p className="text-sm text-muted-foreground">
                    Host from Italy
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our community today and start exchanging your skills for
            unforgettable vacation experiences around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/login">Sign Up Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent"
              asChild
            >
              <Link href="/search">Browse Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Image
                  src="/logo.svg"
                  alt="Urlaub Gegen Hand"
                  width={150}
                  height={40}
                  className="dark:invert"
                />
              </div>
              <p className="text-muted-foreground">
                Exchange your skills for unforgettable vacation experiences
                around the world.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/search"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Find Opportunities
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Host Travelers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Safety Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">
                  Email: info@urlaubgegenhand.com
                </li>
                <li className="text-muted-foreground">
                  Support: support@urlaubgegenhand.com
                </li>
              </ul>
              <div className="flex gap-4 mt-4">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Urlaub Gegen Hand. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
