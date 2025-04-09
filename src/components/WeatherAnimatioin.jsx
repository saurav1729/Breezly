"use client"

import { useEffect, useRef, useState } from "react"

export function WeatherAnimation({ weatherType, timeOfDay,  home = false }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [weatherImages, setWeatherImages] = useState({
    cloud: null,
    rainDrop: null,
    snowflake: null,
    sun: null,
    moon: null,
    lightning: null,
    star: null
  })

  // Preload images
  useEffect(() => {
    const images = {
      cloud: new Image(),
      rainDrop: new Image(),
      snowflake: new Image(),
      sun: new Image(),
      moon: new Image(),
      lightning: new Image(),
      star: new Image()
    }

    // SVG data URIs for weather elements
    images.cloud.src = "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60">
        <path d="M25,45 Q10,45 10,30 Q10,15 25,15 Q30,5 45,5 Q65,5 70,20 Q85,20 90,35 Q90,45 80,45 Z" 
        fill="rgba(255,255,255,0.9)" stroke="rgba(240,240,240,0.5)" stroke-width="1" />
      </svg>
    `)
    
    images.rainDrop.src = "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 20">
        <path d="M5,0 L10,10 Q10,20 5,20 Q0,20 0,10 Z" 
        fill="rgba(100,180,255,0.7)" />
      </svg>
    `)
    
    images.snowflake.src = "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
        <path d="M15,0 L15,30 M0,15 L30,15 M5,5 L25,25 M5,25 L25,5" 
        stroke="rgba(255,255,255,0.9)" stroke-width="1.5" />
        <circle cx="15" cy="15" r="3" fill="white" />
      </svg>
    `)
    
    images.sun.src = "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="25" fill="rgba(255,220,100,0.9)" />
        <g stroke="rgba(255,220,100,0.7)" stroke-width="4" stroke-linecap="round">
          <line x1="50" y1="10" x2="50" y2="25" />
          <line x1="50" y1="75" x2="50" y2="90" />
          <line x1="10" y1="50" x2="25" y2="50" />
          <line x1="75" y1="50" x2="90" y2="50" />
          <line x1="22" y1="22" x2="33" y2="33" />
          <line x1="67" y1="67" x2="78" y2="78" />
          <line x1="22" y1="78" x2="33" y2="67" />
          <line x1="67" y1="33" x2="78" y2="22" />
        </g>
      </svg>
    `)
    
    images.moon.src = "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="M50,15 A35,35 0 1,1 50,85 A25,25 0 1,0 50,15" 
        fill="rgba(240,240,200,0.9)" />
      </svg>
    `)
    
    images.lightning.src = "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 120">
        <path d="M30,0 L20,50 L40,55 L10,120 L20,70 L0,65 Z" 
        fill="rgba(255,255,200,0.9)" />
      </svg>
    `)
    
    images.star.src = "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M10,0 L12,7 L20,7 L14,12 L16,20 L10,15 L4,20 L6,12 L0,7 L8,7 Z" 
        fill="rgba(255,255,255,0.8)" />
      </svg>
    `)

    // When all images are loaded
    let loadedCount = 0
    const totalImages = Object.keys(images).length

    const onImageLoad = () => {
      loadedCount++
      if (loadedCount === totalImages) {
        setWeatherImages(images)
        setImagesLoaded(true)
      }
    }

    Object.values(images).forEach(img => {
      if (img.complete) {
        onImageLoad()
      } else {
        img.onload = onImageLoad
      }
    })

    return () => {
      Object.values(images).forEach(img => {
        img.onload = null
      })
    }
  }, [])

  useEffect(() => {
    if (!imagesLoaded) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = (canvas.width = canvas.offsetWidth)
    const height = (canvas.height = canvas.offsetHeight)
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    ctx.clearRect(0, 0, width, height)

    // Different animation based on weather type
    switch (weatherType) {
      case "rain":
      case "drizzle":
        drawRain(ctx, width, height, timeOfDay)
        break
      case "snow":
        drawSnow(ctx, width, height, timeOfDay)
        break
      case "clouds":
        drawClouds(ctx, width, height, timeOfDay)
        break
      case "clear":
        drawClear(ctx, width, height, timeOfDay)
        break
      case "thunderstorm":
        drawThunderstorm(ctx, width, height, timeOfDay)
        break
      case "mist":
      case "fog":
      case "haze":
        drawMist(ctx, width, height, timeOfDay)
        break
      default:
        drawClear(ctx, width, height, timeOfDay)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [weatherType, timeOfDay, imagesLoaded, weatherImages])

  // Rain animation with SVG images
  function drawRain(ctx, width, height, timeOfDay) {
    const raindrops = []
    const dropCount = Math.floor((width * height) / 10000) * 3

    // Create raindrops
    for (let i = 0; i < dropCount; i++) {
      raindrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 7 + 5,
        speed: Math.random() * 10 + 10,
        opacity: Math.random() * 0.4 + 0.3,
      })
    }

    // Add a few clouds
    const clouds = []
    for (let i = 0; i < 3; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * (height / 3),
        size: Math.random() * 80 + 60,
        speed: Math.random() * 0.5 + 0.1,
        opacity: timeOfDay === "day" ? 0.8 : 0.5,
      })
    }

    function animate() {
      ctx.clearRect(0, 0, width, height)

      // Draw clouds using SVG
      clouds.forEach((cloud) => {
        ctx.globalAlpha = cloud.opacity
        ctx.drawImage(
          weatherImages.cloud,
          cloud.x - cloud.size/2,
          cloud.y - cloud.size/3,
          cloud.size,
          cloud.size/2
        )
        ctx.globalAlpha = 1.0

        // Move cloud
        cloud.x += cloud.speed
        if (cloud.x > width + cloud.size) {
          cloud.x = -cloud.size
        }
      })

      // Draw raindrops using SVG
      raindrops.forEach((drop) => {
        ctx.globalAlpha = drop.opacity
        ctx.drawImage(
          weatherImages.rainDrop,
          drop.x - drop.size/2,
          drop.y,
          drop.size,
          drop.size * 2
        )
        ctx.globalAlpha = 1.0

        // Move raindrop
        drop.y += drop.speed

        // Reset raindrop when it goes off screen
        if (drop.y > height) {
          drop.y = -drop.size * 2
          drop.x = Math.random() * width
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  // Snow animation with SVG images
  function drawSnow(ctx, width, height, timeOfDay) {
    const snowflakes = []
    const flakeCount = Math.floor((width * height) / 10000) * 2

    // Create snowflakes
    for (let i = 0; i < flakeCount; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 15 + 8,
        speed: Math.random() * 2 + 1,
        wind: Math.random() * 1 - 0.5,
        spin: Math.random() * 0.02 - 0.01,
        angle: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.5 + 0.5,
      })
    }
    
    // Add some light clouds
    const clouds = []
    for (let i = 0; i < 2; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * (height / 4),
        size: Math.random() * 100 + 60,
        speed: Math.random() * 0.3 + 0.1,
        opacity: timeOfDay === "day" ? 0.4 : 0.2,
      })
    }

    function animate() {
      ctx.clearRect(0, 0, width, height)
      
      // Draw light clouds
      clouds.forEach((cloud) => {
        ctx.globalAlpha = cloud.opacity
        ctx.drawImage(
          weatherImages.cloud,
          cloud.x - cloud.size/2,
          cloud.y - cloud.size/3,
          cloud.size,
          cloud.size/2
        )
        ctx.globalAlpha = 1.0
        
        // Move cloud
        cloud.x += cloud.speed
        if (cloud.x > width + cloud.size) {
          cloud.x = -cloud.size
        }
      })

      // Draw snowflakes
      snowflakes.forEach((flake) => {
        ctx.globalAlpha = flake.opacity
        ctx.save()
        ctx.translate(flake.x, flake.y)
        ctx.rotate(flake.angle)
        ctx.drawImage(
          weatherImages.snowflake,
          -flake.size/2,
          -flake.size/2,
          flake.size,
          flake.size
        )
        ctx.restore()
        ctx.globalAlpha = 1.0

        // Move snowflake
        flake.y += flake.speed
        flake.x += flake.wind
        flake.angle += flake.spin

        // Reset snowflake when it goes off screen
        if (flake.y > height) {
          flake.y = -flake.size
          flake.x = Math.random() * width
        }

        if (flake.x > width + flake.size) {
          flake.x = -flake.size
        } else if (flake.x < -flake.size) {
          flake.x = width + flake.size
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  // Clouds animation with SVG images
  function drawClouds(ctx, width, height, timeOfDay) {
    const clouds = []
    const cloudCount = 5

    // Create clouds of different sizes and speeds
    for (let i = 0; i < cloudCount; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * (height / 2),
        size: Math.random() * 120 + 80,
        speed: Math.random() * 0.5 + 0.1,
        opacity: timeOfDay === "day" ? 
          (Math.random() * 0.3 + 0.6) : // More visible during day
          (Math.random() * 0.2 + 0.3),  // Less visible at night
      })
    }

    function animate() {
      ctx.clearRect(0, 0, width, height)

      // Draw clouds using SVG images
      clouds.forEach((cloud) => {
        ctx.globalAlpha = cloud.opacity
        ctx.drawImage(
          weatherImages.cloud,
          cloud.x - cloud.size/2,
          cloud.y - cloud.size/3,
          cloud.size,
          cloud.size/2
        )
        ctx.globalAlpha = 1.0

        // Move cloud
        cloud.x += cloud.speed

        // Reset cloud when it goes off screen
        if (cloud.x > width + cloud.size/2) {
          cloud.x = -cloud.size/2
          cloud.y = Math.random() * (height / 2)
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  // Clear sky animation with SVG images
  function drawClear(ctx, width, height, timeOfDay) {
    if (timeOfDay === "day") {
      // Day animation with SVG sun
      const sun = {
        x: width * 0.8,
        y: height * 0.2,
        size: Math.min(width, height) * 0.25,
        angle: 0,
        rotationSpeed: 0.0005,
      }

      function animate() {
        ctx.clearRect(0, 0, width, height)

        // Draw sun using SVG
        ctx.save()
        ctx.translate(sun.x, sun.y)
        ctx.rotate(sun.angle)
        ctx.drawImage(
          weatherImages.sun, 
          -sun.size/2, 
          -sun.size/2, 
          sun.size, 
          sun.size
        )
        ctx.restore()

        // Slowly rotate the sun
        sun.angle += sun.rotationSpeed

        animationRef.current = requestAnimationFrame(animate)
      }

      animate()
    } else {
      // Night animation with SVG moon and stars
      const moon = {
        x: width * 0.8,
        y: height * 0.2,
        size: Math.min(width, height) * 0.2,
      }

      const stars = []
      const starCount = Math.floor((width * height) / 10000)

      // Create stars
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 10 + 5,
          twinkleSpeed: Math.random() * 0.05 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          opacity: 0.7,
        })
      }

      function animate() {
        ctx.clearRect(0, 0, width, height)

        // Draw moon using SVG
        ctx.drawImage(
          weatherImages.moon,
          moon.x - moon.size/2,
          moon.y - moon.size/2,
          moon.size,
          moon.size
        )

        // Draw stars using SVG
        stars.forEach((star) => {
          // Calculate twinkling effect
          const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7
          ctx.globalAlpha = star.opacity * twinkle
          
          // Draw star
          if (Math.random() > 0.98 && star.size > 8) {
            // Sometimes draw actual star shape for larger stars
            ctx.drawImage(
              weatherImages.star,
              star.x - star.size/2,
              star.y - star.size/2,
              star.size,
              star.size
            )
          } else {
            // Mostly just draw circles for small stars
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.size/6, 0, Math.PI * 2)
            ctx.fillStyle = "white"
            ctx.fill()
          }
          ctx.globalAlpha = 1.0

          // Update twinkling phase
          star.twinklePhase += star.twinkleSpeed
        })

        animationRef.current = requestAnimationFrame(animate)
      }

      animate()
    }
  }

  // Thunderstorm animation with SVG images
  function drawThunderstorm(ctx, width, height, timeOfDay) {
    const raindrops = []
    const dropCount = Math.floor((width * height) / 10000) * 3

    // Create raindrops
    for (let i = 0; i < dropCount; i++) {
      raindrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 5,
        speed: Math.random() * 15 + 15,
        opacity: Math.random() * 0.6 + 0.2,
      })
    }

    // Add dark clouds
    const clouds = []
    for (let i = 0; i < 4; i++) {
      clouds.push({
        x: (width / 4) * i,
        y: Math.random() * (height / 4),
        size: Math.random() * 140 + 120,
        opacity: 0.8,
      })
    }

    // Lightning variables
    let lightning = {
      active: false,
      x: 0,
      y: 0,
      size: 0,
      opacity: 0,
      timeout: null,
    }

    // Create lightning at random intervals
    function createLightning() {
      if (lightning.active) return

      const randomCloud = clouds[Math.floor(Math.random() * clouds.length)]

      lightning = {
        active: true,
        x: randomCloud.x,
        y: randomCloud.y + randomCloud.size/4,
        size: Math.random() * 60 + 40,
        opacity: 0.9,
        timeout: null,
      }

      // Schedule lightning fade out
      setTimeout(() => {
        lightning.active = false
      }, 200)

      // Schedule next lightning
      setTimeout(createLightning, Math.random() * 5000 + 2000)
    }

    // Start lightning
    createLightning()

    function animate() {
      ctx.clearRect(0, 0, width, height)

      // Draw dark stormy clouds
      clouds.forEach((cloud) => {
        // Draw a darker cloud
        ctx.globalAlpha = cloud.opacity
        ctx.drawImage(
          weatherImages.cloud,
          cloud.x - cloud.size/2,
          cloud.y - cloud.size/3,
          cloud.size,
          cloud.size/2
        )
        ctx.globalAlpha = 1.0
      })

      // Draw lightning using SVG
      if (lightning.active) {
        ctx.globalAlpha = lightning.opacity
        ctx.drawImage(
          weatherImages.lightning,
          lightning.x,
          lightning.y,
          lightning.size,
          lightning.size * 2
        )
        ctx.globalAlpha = 1.0

        // Create a brief flash effect when lightning appears
        if (lightning.opacity > 0.7) {
          ctx.fillStyle = `rgba(255, 255, 220, ${lightning.opacity / 10})`;
          ctx.fillRect(0, 0, width, height);
        }
      }

      // Draw raindrops
      raindrops.forEach((drop) => {
        ctx.globalAlpha = drop.opacity
        ctx.drawImage(
          weatherImages.rainDrop,
          drop.x - drop.size/2,
          drop.y,
          drop.size,
          drop.size * 2
        )
        ctx.globalAlpha = 1.0

        // Move raindrop
        drop.y += drop.speed

        // Reset raindrop when it goes off screen
        if (drop.y > height) {
          drop.y = -drop.size * 2
          drop.x = Math.random() * width
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  // Mist/fog animation with SVG elements
  function drawMist(ctx, width, height, timeOfDay) {
    const mistParticles = []
    const particleCount = 20

    // Create mist particles
    for (let i = 0; i < particleCount; i++) {
      mistParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 200 + 100,
        opacity: Math.random() * 0.2 + 0.1,
        speed: Math.random() * 0.5 + 0.1,
      })
    }

    // Add a hint of sun/moon if appropriate
    const celestialBody = {
      x: width * 0.8,
      y: height * 0.2,
      size: Math.min(width, height) * 0.15,
      opacity: 0.3, // Very faint through the mist
    }

    function animate() {
      ctx.clearRect(0, 0, width, height)

      // Draw very faint sun/moon if appropriate
      if (timeOfDay === "day") {
        ctx.globalAlpha = celestialBody.opacity
        ctx.drawImage(
          weatherImages.sun,
          celestialBody.x - celestialBody.size/2,
          celestialBody.y - celestialBody.size/2,
          celestialBody.size,
          celestialBody.size
        )
        ctx.globalAlpha = 1.0
      } else {
        ctx.globalAlpha = celestialBody.opacity / 2
        ctx.drawImage(
          weatherImages.moon,
          celestialBody.x - celestialBody.size/2,
          celestialBody.y - celestialBody.size/2,
          celestialBody.size,
          celestialBody.size
        )
        ctx.globalAlpha = 1.0
      }

      // Draw mist particles (using clouds with lower opacity)
      mistParticles.forEach((particle) => {
        ctx.globalAlpha = particle.opacity
        ctx.drawImage(
          weatherImages.cloud,
          particle.x - particle.size/2,
          particle.y - particle.size/3,
          particle.size,
          particle.size/2
        )
        ctx.globalAlpha = 1.0

        // Move particle
        particle.x += particle.speed

        // Reset particle when it goes off screen
        if (particle.x - particle.size > width) {
          particle.x = -particle.size
          particle.y = Math.random() * height
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  if (!imagesLoaded) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <p className="text-gray-400">Loading weather animations...</p>
      </div>
    )
  }
  if (home) {
    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ opacity: 0.4 }}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.8, pointerEvents: "none" }}
    />
  )
  }