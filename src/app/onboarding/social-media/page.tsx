"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateUserProfile } from "@/action/user";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok, FaPinterest, FaSnapchat, FaReddit, FaTumblr } from 'react-icons/fa';
import './social-media.css'
const socialMediaIcons = [
  { icon: FaFacebook, name: "Facebook" }, { icon: FaTwitter, name: "Twitter" }, { icon: FaInstagram, name: "Instagram" }, { icon: FaLinkedin, name: "LinkedIn" }, { icon: FaYoutube, name: "YouTube" },
  { icon: FaTiktok, name: "TikTok" }, { icon: FaPinterest, name: "Pinterest" }, { icon: FaSnapchat, name: "Snapchat" }, { icon: FaReddit, name: "Reddit" }, { icon: FaTumblr, name: "Tumblr" }
];

interface SocialLink {
  platform: string;
  link: string;
}

const SocialMediaPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  const handleIconSelect = (icon: string) => {
    setSelectedIcons(prev => 
      prev.includes(icon) 
        ? prev
        : [...prev, icon]
    );
    setSocialLinks(prev => {
      if (prev.some(link => link.platform === icon)) {
        return prev;
      }
      return [...prev, { platform: icon, link: '' }];
    });
  };

  const handleLinkChange = (platform: string, value: string) => {
    setSocialLinks(prev => prev.map(link => 
      link.platform === platform ? { ...link, link: value } : link
    ));
  };

  const handleSubmit = async () => {
    await updateUserProfile(socialLinks);
    router.push('/onboarding/profile');
  };

  return (
    <div className="h-screen w-full flex justify-center items-center p-4" style={{ backgroundColor: '#ffd39e', color: '#5f45f2' }}>
      <div className="max-w-lg p-6 givemargins" style={{ backgroundColor: '#ffd39e', borderColor: '#5f45f2' , background:'red' }}>
        <div className="child-margin">
        <CardHeader className="mb-4">
          <CardTitle className="text-2xl font-bold text-center" style={{ color: '#5f45f2' }}>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <>
              <p className="mb-4" style={{ color: '#5f45f2' }}>Select your preferred social media platforms:</p>
              <div className="grid grid-cols-5 gap-4 my-4">
                {socialMediaIcons.map(({ icon: Icon, name }) => (
                  <button 
                    key={name}
                    onClick={() => handleIconSelect(name)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl
                      ${selectedIcons.includes(name) 
                        ? 'bg-white text-black border-green-500' 
                        : 'bg-gray-800 text-white'}`}
                  >
                    {  <Icon  /> }
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {socialLinks.map(({ platform, link }) => (
                <div key={platform} className="mb-4">
                  <label htmlFor={platform} className="font-bold" style={{ color: '#5f45f2' }}>{platform}</label>
                  <Input
                    id={platform}
                    value={link}
                    onChange={(e) => handleLinkChange(platform, e.target.value)}
                    placeholder={`Enter your ${platform} link`}
                    className="bg-white text-black border-gray-700"
                  />
                </div>
              ))}
            </>
          )}
          <div className="flex justify-between mt-4">
            
           
            <Button 
              onClick={() => step === 1 ? setStep(2) : handleSubmit()}
              disabled={step === 1 && selectedIcons.length === 0}
              className="w-full bg-white text-black hover:bg-gray-200" // Change here
              style={{ backgroundColor: '#5f45f2', color: '#ffd39e' }} // Change here
            >
              {step === 1 ? 'Continue' : 'Finish'}
            </Button>
          </div>
        </CardContent>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPage;
