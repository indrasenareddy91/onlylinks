"use client"
import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { deleteLink, addLink, updateProfile } from '@/action/user'

interface Link {
  _id: string;
  link: string;
  platform: string;
}

interface UserData {
  name: string;
  profileBio: string;
  email: string;
  isUsernameSet: boolean;
  socialLinks: Link[];
  profilePic: string;
  profileDisplayName: string;
  username: string;
}

const ProfileEditor = ({ userData }: { userData: UserData }) => {
  const [name, setName] = useState(userData.name)
  const [bio, setBio] = useState(userData.profileBio)
  const [links, setLinks] = useState<Link[]>(userData.socialLinks)
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [newLinkTitle, setNewLinkTitle] = useState('')

  useEffect(() => {
    setName(userData.name)
    setBio(userData.profileBio)
    setLinks(userData.socialLinks)
  }, [userData])

  const handleAddLink = async () => {
    if (newLinkUrl && newLinkTitle) {
      const newLink: Link = {
        _id: Date.now().toString(),
        link: newLinkUrl,
        platform: newLinkTitle
      }
      const response = await addLink(newLink)
      if (response) {
        setLinks([...links, newLink])
        setNewLinkUrl('')
        setNewLinkTitle('')
      } else {
        alert('Failed to add link')
      }
    }
  }

  const handleDeleteLink = async (id: string) => {
    setLinks(links.filter(link => link._id !== id))
    await deleteLink(id)
  }

  const handleUpdateLink = (id: string, field: 'link' | 'platform', value: string) => {
    setLinks(links.map(link => 
      link._id === id ? { ...link, [field]: value } : link
    ))
  }

  const handleSaveProfile = async () => {
    const updatedProfile = {
      name,
      profileBio: bio,
      socialLinks: links
    }
    const response = await updateProfile(updatedProfile)
    if (response) {
      alert('Profile updated successfully')
    } else {
      alert('Failed to update profile')
    }
  }

  return (
    <div className="h-screen overflow-hidden scrollbar-hide mt-5" style={{ backgroundColor: '#ffd39e' }}>
<div className="h-full overflow-y-auto px-4 scrollbar-hide shit" style={{ scrollbarWidth: 'none', background: "#ffd39e", boxShadow: 'none' }}>        <div className="max-w-3xl mx-auto my-8 pb-8">
          <Card className=" rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:shadow-3xl ">
            <CardHeader className="text-white p-2">
              <div className="flex flex-col items-center space-y-3">
                <CardTitle className="text-2xl font-bold tracking-tight" style={{ color: '#5f45f2' }}>Your Public Profile</CardTitle>
                <div className="bg-opacity-20 bg-white px-4 py-2 rounded-full backdrop-blur-sm">
                  <span className="text-sm font-medium" style={{ color: '#5f45f2' }}>
                    {`https://yourwebsite.com/${userData.username}`}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-lg font-semibold" style={{ color: '#5f45f2' }}>Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition duration-300"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="bio" className="text-lg font-semibold" style={{ color: '#5f45f2' }}>Bio</Label>
                <Input
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition duration-300"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold" style={{ color: '#5f45f2' }}>Your Links</h3>
                {links.map(link => (
                  <div key={link._id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
                    <Input
                      value={link.link}
                      onChange={(e) => handleUpdateLink(link._id, 'link', e.target.value)}
                      placeholder="URL"
                      className="flex-grow focus:ring-2 focus:ring-black transition duration-300"
                    />
                    <Input
                      value={link.platform}
                      onChange={(e) => handleUpdateLink(link._id, 'platform', e.target.value)}
                      placeholder="Title"
                      className="flex-grow focus:ring-2 focus:ring-black transition duration-300"
                    />
                    <Button
                      onClick={() => handleDeleteLink(link._id)}
                      variant="outline"
                      size="sm"
                      className="bg-white text-black border-2 border-black hover:bg-gray-200 transition duration-300"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                <div className="flex items-center space-x-3 mt-4">
                  <Input
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="New URL"
                    className="flex-grow focus:ring-2 focus:ring-black transition duration-300"
                  />
                  <Input
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    placeholder="New Title"
                    className="flex-grow focus:ring-2 focus:ring-black transition duration-300"
                  />
                  <Button
                    onClick={handleAddLink}
                    variant="outline"
                    size="sm"
                    className="bg-black text-white hover:bg-gray-800 transition duration-300"
                  >
                    Add
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleSaveProfile}
                className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-2 rounded-lg hover:from-gray-800 hover:to-black transition duration-300 transform hover:scale-105"
              >
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfileEditor