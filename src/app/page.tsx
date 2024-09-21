import React from 'react'
import Link from 'next/link'
import { auth } from "@/auth"
import './root.css'
import { redirect } from "next/navigation"
import UsernameInput from './UsernameInput'
import Font from '@next/font/local'
import Image from 'next/image'

const myFont = Font({
  src: [
    {
      path: '../fonts/b.ttf',
      style: 'normal',
    },
  ],
  variable: '--font-my-font',
})

const navbarFont = Font({
  src: [
    {
      path: '../fonts/a.ttf',
      style: 'normal',
      weight: "400"
    },
  ],
  variable: '--font-navbar',
})

const colors = {
  text: '#5f45f2',
  background: '#ffd39e'
}

const Home = async () => {
  const session = await auth()
  if (session) {  
    redirect('/dashboard')
  }
const handleClick = () => {
  console.log('clicked')
}
  return (
    <body style={{ backgroundColor: colors.background, color: colors.text }}>
      <header className="navbar">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: colors.text,
          width: '100%',
          height: '70px',
          margin: '0 65px',
          borderRadius: "20px"
        }}>
          <div style={{
            fontFamily: myFont.style.fontFamily,
            fontSize: '40px',
            color: "white",
            marginLeft: "10px"
          }}>
            OL
          </div>
          <div className="auth-buttons" style={{
            fontFamily: navbarFont.style.fontFamily,
          }}>
            <button className="login" style={{ background: colors.text, color: "white" }}>Log in</button>
            <button className="signup" style={{
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
              background: colors.text,
              color: "white"
            }}>Sign up</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-text">
          <h1 style={{ fontFamily: myFont.style.fontFamily, color: "#5f45f2"  , fontWeight:"bolder"}}>
            Share your content.<br />not your body
          </h1>
          <p style={{ fontFamily: navbarFont.style.fontFamily, color: colors.text }}>
            Simple, Minimal, and free.
          </p>
          <div className="cta-buttons" style={{ fontFamily: navbarFont.style.fontFamily }}>
            <input 
              type="text" 
              placeholder="onlylink.com/yourname" 
              className='customInput' 
              style={{
                width: "300px",
                background: "white",
                color: colors.text,
                border: `2px solid ${colors.text}`,
                borderRadius: "0px",
                padding: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            />
            <button style={{
              background: colors.text,
              color: "white"
            }}>
              <Link href="/register">Claim your OnlyLink</Link>
            </button>
          </div>
        </div>
        <div className="hero-image">
         
        </div>
      </main>
    </body>
  )
}

export default Home