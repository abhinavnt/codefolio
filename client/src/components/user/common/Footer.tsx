import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#101828] py-16 px-10 border-t">
        <div className="container">
            <div className="grid gap-10 md:grid-cols-4">
                <div>
                    <Link to="/" className="flex items-center mb-4">
                        <div className="flex items-center text-[#20B486]">
                            <span className="text-3xl font-bold">&lt;/&gt;</span>
                            <span className="ml-2 text-xl font-bold uppercase">CODEFOLIO</span>
                        </div>
                    </Link>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        The leading platform for online learning with thousands of courses taught by expert instructors.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-gray-300 text-lg mb-4">Company</h3>
                    <ul>
                        {['About Us', 'Careers', 'Press', 'Blog'].map((item) => (
                            <li key={item} className="mb-2">
                                <Link to="#" className="text-sm text-gray-300 hover:text-[#20B486]">{item}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-gray-300 text-lg mb-4">Resources</h3>
                    <ul>
                        {['Documentation', 'Help Center', 'Community', 'Partners'].map((item) => (
                            <li key={item} className="mb-2">
                                <Link to="#" className="text-sm text-gray-300 hover:text-[#20B486]">{item}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-gray-300 text-lg mb-4">Subscribe to our newsletter</h3>
                    <p className="text-sm text-gray-300 mb-4">
                        Get the latest updates and news right at your inbox.
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                        />
                        <Button className="bg-[#20B486] hover:bg-[#579380] h-12 px-4">
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-12">
                <p className="text-sm text-gray-300">© 2025 Codefolio. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                        <Link key={item} to="#" className="text-sm text-gray-300 hover:text-[#20B486]">{item}</Link>
                    ))}
                </div>
            </div>
        </div>
    </footer>
    );
};

export default Footer;
