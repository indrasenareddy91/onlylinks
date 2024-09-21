import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateUserProfile } from "@/action/user";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok, FaPinterest, FaSnapchat, FaReddit, FaTumblr } from 'react-icons/fa';
import { useSession } from "next-auth/react";

const socialMediaIcons = [
  { icon: FaFacebook, name: "Facebook" }, { icon: FaTwitter, name: "Twitter" }, { icon: FaInstagram, name: "Instagram" },
  { icon: FaLinkedin, name: "LinkedIn" }, { icon: FaYoutube, name: "YouTube" }, { icon: FaTiktok, name: "TikTok" },
  { icon: FaPinterest, name: "Pinterest" }, { icon: FaSnapchat, name: "Snapchat" }, { icon: FaReddit, name: "Reddit" },
  { icon: FaTumblr, name: "Tumblr" }
];

interface SocialLink {
  _id: string;
  platform: string;
  link: string;
}

const SocialMediaPage = () => {
  const router = useRouter();
  const { data, update } = useSession()
  const [step, setStep] = useState(1);
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleIconSelect = (icon: string) => {
    setSelectedIcons(prev => 
      prev.includes(icon) 
        ? prev.filter(selectedIcon => selectedIcon !== icon)
        : [...prev, icon]
    );
    setSocialLinks(prev => {
      if (prev.some(link => link.platform === icon)) {
        return prev;
      }
      return [...prev, { platform: icon, link: '', _id: Date.now().toString() }];
    });
  };

  const handleLinkChange = (platform: string, value: string) => {
    setSocialLinks(prev => prev.map(link => 
      link.platform === platform ? { ...link, link: value } : link
    ));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await updateUserProfile(socialLinks);
      if (result) {
        update({ user: { ...data?.user, socialLinks } });
        router.push('/onboarding/profile');
      } else {
        alert('Something went wrong. Please refresh the page and try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4" style={{ backgroundColor: '#ffd39e', color: '#5f45f2' }}>
      <Card className="w-full max-w-2xl p-6" style={{ backgroundColor: '#fff5e6', borderColor: '#5f45f2', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <CardHeader className="mb-8">
          <CardTitle className="text-3xl font-bold text-center" style={{ color: '#5f45f2' }}>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <>
              <p className="mb-6 text-lg font-semibold text-center" style={{ color: '#5f45f2' }}>Select your preferred social media platforms:</p>
              <div className="grid grid-cols-5 gap-4 mb-10">
                {socialMediaIcons.map(({ icon: Icon, name }) => (
                  <button 
                    key={name}
                    onClick={() => handleIconSelect(name)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-200 ease-in-out transform hover:scale-110
                      ${selectedIcons.includes(name) 
                        ? 'bg-white text-black border-solid border-4 border-violet-800' 
                        : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                  >
                    <Icon />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="mb-6 text-lg font-semibold text-center" style={{ color: '#5f45f2' }}>Enter your social media links:</p>
              <div className="grid gap-6 mb-6">
                {socialLinks.map(({ platform, link }) => (
                  <div key={platform} className="flex items-center space-x-4">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-800 flex items-center justify-center text-white">
                      {React.createElement(socialMediaIcons.find(icon => icon.name === platform)?.icon || 'div')}
                    </div>
                    <Input
                      value={link}
                      onChange={(e) => handleLinkChange(platform, e.target.value)}
                      placeholder={`Enter your ${platform} link`}
                      className="flex-grow bg-white text-black border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-200"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="flex justify-between mt-8">
            {step === 2 && (
              <Button 
                onClick={() => setStep(1)}
                className="bg-gray-200 text-black hover:bg-gray-300"
              >
                Back
              </Button>
            )}
            <Button 
              onClick={() => step === 1 ? setStep(2) : handleSubmit()}
              disabled={(step === 1 && selectedIcons.length === 0) || isLoading}
              className={`w-full ${step === 1 ? 'ml-auto' : ''} transition-all duration-200 ease-in-out`}
              style={{ backgroundColor: '#5f45f2', color: '#ffd39e' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                step === 1 ? 'Continue' : 'Finish'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaPage;