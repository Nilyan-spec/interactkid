'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pizza, Heart, PlayCircle, ArrowLeft, Star, HandIcon as HandWave, Moon, Sun, Settings, Volume2, VolumeX, Trash2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Item = {
  text: string
  phrase: string
}

type Category = {
  name: string
  icon: React.ReactNode
  items: Item[]
  basePhrase: string
}

const initialCategories: Category[] = [
  {
    name: 'Greetings',
    icon: <HandWave className="h-6 w-6" />,
    items: [
      { text: 'Hello', phrase: 'Hello' },
      { text: 'Good morning', phrase: 'Good morning' },
      { text: 'Good afternoon', phrase: 'Good afternoon' },
      { text: 'Good night', phrase: 'Good night' },
      { text: 'Thank you', phrase: 'Thank you' },
      { text: 'Please', phrase: 'Please' },
      { text: 'You're welcome', phrase: 'You're welcome' },
      { text: 'How are you?', phrase: 'How are you?' }
    ],
    basePhrase: 'I want to say'
  },
  {
    name: 'Food',
    icon: <Pizza className="h-6 w-6" />,
    items: [
      { text: 'Adobo', phrase: 'I want Adobo' },
      { text: 'Fried Chicken', phrase: 'I want Fried Chicken' },
      { text: 'Bangus', phrase: 'I want Bangus' },
      { text: 'Broccoli', phrase: 'I want Broccoli' },
      { text: 'Rice', phrase: 'I want Rice' },
      { text: 'Sinigang', phrase: 'I want Sinigang' },
      { text: 'Pancit', phrase: 'I want Pancit' },
      { text: 'Ice cream', phrase: 'I want Ice cream' },
      { text: 'Water', phrase: 'I want Water' },
      { text: 'Juice', phrase: 'I want Juice' }
    ],
    basePhrase: 'I want'
  },
  {
    name: 'Feelings',
    icon: <Heart className="h-6 w-6" />,
    items: [
      { text: 'Happy', phrase: 'I feel happy' },
      { text: 'Sad', phrase: 'I feel sad' },
      { text: 'Excited', phrase: 'I feel excited' },
      { text: 'Tired', phrase: 'I feel tired' },
      { text: 'Angry', phrase: 'I feel angry' },
      { text: 'Scared', phrase: 'I feel scared' },
      { text: 'Surprised', phrase: 'I feel surprised' },
      { text: 'Confused', phrase: 'I feel confused' },
      { text: 'Proud', phrase: 'I feel proud' },
      { text: 'Calm', phrase: 'I feel calm' }
    ],
    basePhrase: 'I feel'
  },
  {
    name: 'Activities',
    icon: <PlayCircle className="h-6 w-6" />,
    items: [
      { text: 'Play', phrase: 'I want to play' },
      { text: 'Read', phrase: 'I want to read' },
      { text: 'Draw', phrase: 'I want to draw' },
      { text: 'Sleep', phrase: 'I want to sleep' },
      { text: 'Sing', phrase: 'I want to sing' },
      { text: 'Dance', phrase: 'I want to dance' },
      { text: 'Run', phrase: 'I want to run' },
      { text: 'Jump', phrase: 'I want to jump' },
      { text: 'Swim', phrase: 'I want to swim' },
      { text: 'Watch TV', phrase: 'I want to watch TV' }
    ],
    basePhrase: 'I want to'
  },
  {
    name: 'Misc',
    icon: <Star className="h-6 w-6" />,
    items: [
      { text: 'I like that', phrase: 'I like that' },
      { text: 'Don\'t worry', phrase: 'Don\'t worry' }
    ],
    basePhrase: ''
  },
  {
    name: 'Favorites',
    icon: <Star className="h-6 w-6" />,
    items: [],
    basePhrase: ''
  }
]

const mainButtons = ['Yes', 'No', 'Yes please', 'No please', 'Maybe']

const KidSilhouette = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10C44.5 10 40 14.5 40 20C40 25.5 44.5 30 50 30C55.5 30 60 25.5 60 20C60 14.5 55.5 10 50 10ZM30 40C30 35.6 26.4 32 22 32C17.6 32 14 35.6 14 40C14 44.4 17.6 48 22 48C26.4 48 30 44.4 30 40ZM78 32C73.6 32 70 35.6 70 40C70 44.4 73.6 48 78 48C82.4 48 86 44.4 86 40C86 35.6 82.4 32 78 32ZM50 40C42.3 40 36 46.3 36 54V90H64V54C64 46.3 57.7 40 50 40Z" />
  </svg>
)

export default function Component() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [phrase, setPhrase] = useState('')
  const [stars, setStars] = useState<{ id: number; style: React.CSSProperties }[]>([])
  const [kids, setKids] = useState<{ id: number; style: React.CSSProperties }[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [favorites, setFavorites] = useState<Item[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newItemText, setNewItemText] = useState('')
  const [newItemPhrase, setNewItemPhrase] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('')
  const [categoryToDelete, setCategoryToDelete] = useState('')
  const [itemToDelete, setItemToDelete] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const newStars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
      },
    }))
    setStars(newStars)

    const newKids = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        transform: `scale(${0.5 + Math.random() * 0.5}) rotate(${Math.random() * 360}deg)`,
      },
    }))
    setKids(newKids)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const particles: { x: number; y: number; radius: number; color: string; velocity: { x: number; y: number } }[] = []

        for (let i = 0; i < 50; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 5 + 1,
            color: `hsl(${Math.random() * 360}, 50%, 50%)`,
            velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 }
          })
        }

        function animate() {
          requestAnimationFrame(animate)
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          particles.forEach(particle => {
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
            ctx.fillStyle = particle.color
            ctx.fill()

            particle.x += particle.velocity.x
            particle.y += particle.velocity.y

            if (particle.x < 0 || particle.x > canvas.width) particle.velocity.x *= -1
            if (particle.y < 0 || particle.y > canvas.height) particle.velocity.y *= -1
          })
        }

        animate()
      }
    }
  }, [])

  const handleCategoryClick = (category: Category) => {
    playAudioCue()
    setSelectedCategory(category)
    setPhrase(category.basePhrase)
  }

  const handleItemClick = (item: Item) => {
    playAudioCue()
    setPhrase(item.phrase)
    playAudio(item.phrase)
    setHistory(prev => [item.phrase, ...prev.slice(0, 4)])
    if (selectedCategory && selectedCategory.name !== 'Favorites') {
      toggleFavorite(item)
    }
  }

  const handleMainButtonClick = (button: string) => {
    playAudioCue()
    setPhrase(button)
    playAudio(button)
    setHistory(prev => [button, ...prev.slice(0, 4)])
  }

  const playAudio = (text: string) => {
    if (!isMuted) {
      const speech = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(speech)
    }
  }

  const playAudioCue = () => {
    if (!isMuted) {
      const audio = new Audio("/button-click.mp3")
      audio.play()
    }
  }

  const goBack = () => {
    setSelectedCategory(null)
    setPhrase('')
  }

  const toggleFavorite = (item: Item) => {
    setFavorites(prev =>
      prev.some(f => f.text === item.text && f.phrase === item.phrase)
        ? prev.filter(f => f.text !== item.text || f.phrase !== item.phrase)
        : [...prev, item]
    )
  }

  const addNewCategory = () => {
    if (newCategoryName) {
      setCategories(prev => [...prev, {
        name: newCategoryName,
        icon: <Star className="h-6 w-6" />,
        items: [],
        basePhrase: ''
      }])
      setNewCategoryName('')
    }
  }

  const addNewItem = () => {
    if (newItemText && newItemPhrase && newItemCategory) {
      setCategories(prev => prev.map(category => 
        category.name === newItemCategory
          ? { ...category, items: [...category.items, { text: newItemText, phrase: newItemPhrase }] }
          : category
      ))
      setNewItemText('')
      setNewItemPhrase('')
      setNewItemCategory('')
    }
  }

  const deleteCategory = () => {
    if (categoryToDelete) {
      setCategories(prev => prev.filter(category => category.name !== categoryToDelete))
      if (selectedCategory?.name === categoryToDelete) {
        setSelectedCategory(null)
      }
      setCategoryToDelete('')
    }
  }

  const deleteItem = () => {
    if (itemToDelete && newItemCategory) {
      setCategories(prev => prev.map(category => 
        category.name === newItemCategory
          ? { ...category, items: category.items.filter(item => item.text !== itemToDelete) }
          : category
      ))
      setItemToDelete('')
      setNewItemCategory('')
    }
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {stars.map((star) => (
        <Star
          key={star.id}
          className="absolute text-yellow-200 animate-twinkle"
          style={star.style}
        />
      ))}
      {kids.map((kid) => (
        <KidSilhouette
          key={kid.id}
          className="absolute w-24 h-24 text-white opacity-10"
          style={kid.style}
        />
      ))}
      <div className="absolute inset-0 bg-repeat bg-contain" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")" }}></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              aria-label="Toggle sound"
            >
              {isMuted ? <VolumeX className="h-[1.2rem] w-[1.2rem]" /> : <Volume2 className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              aria-label="Open settings"
            >
              <Settings className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-center mb-8 text-purple-700 dark:text-purple-300 animate-bounce">What do you want to say?</h1>
          <motion.div 
            className="text-3xl font-semibold text-center mb-8 h-12 text-pink-600 dark:text-pink-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {phrase}
          </motion.div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
            <div>Recent: {history.join(' • ')}</div>
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-red-500">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </div>
          {/* Main buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {mainButtons.map((button) => (
              <motion.div key={button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="h-16 px-6 text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full shadow-lg"
                  onClick={() => handleMainButtonClick(button)}
                  aria-label={`Select ${button}`}
                >
                  {button}
                </Button>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newCategory">Add New Category</Label>
                    <div className="flex mt-1">
                      <Input
                        id="newCategory"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Category name"
                      />
                      <Button onClick={addNewCategory} className="ml-2">Add</Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newItem">Add New Item</Label>
                    <div className="flex flex-col mt-1 space-y-2">
                      <Input
                        id="newItemText"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="Button text"
                      />
                      <Input
                        id="newItemPhrase"
                        value={newItemPhrase}
                        onChange={(e) => setNewItemPhrase(e.target.value)}
                        placeholder="Phrase to speak"
                      />
                      <div className="flex">
                        <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.filter(c => c.name !== 'Favorites').map((category) => (
                              <SelectItem key={category.name} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={addNewItem} className="ml-2">Add</Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Delete Category</Label>
                    <div className="flex mt-1">
                      <Select value={categoryToDelete} onValueChange={setCategoryToDelete}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(c => c.name !== 'Favorites').map((category) => (
                            <SelectItem key={category.name} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="ml-2" disabled={!categoryToDelete}>Delete</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete the category and all its items.
                            </DialogDescription>
                          </DialogHeader>
                          <Button onClick={deleteCategory}>Yes, delete category</Button>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div>
                    <Label>Delete Item</Label>
                    <div className="flex flex-col mt-1 space-y-2">
                      <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(c => c.name !== 'Favorites').map((category) => (
                            <SelectItem key={category.name} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex">
                        <Select value={itemToDelete} onValueChange={setItemToDelete}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Item" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.find(c => c.name === newItemCategory)?.items.map((item) => (
                              <SelectItem key={item.text} value={item.text}>
                                {item.text}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="ml-2" disabled={!itemToDelete || !newItemCategory}>Delete</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure?</DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will permanently delete the item.
                              </DialogDescription>
                            </DialogHeader>
                            <Button onClick={deleteItem}>Yes, delete item</Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {selectedCategory ? (
              <>
                <Button
                  variant="outline"
                  className="col-span-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-lg font-semibold"
                  onClick={goBack}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
                </Button>
                {(selectedCategory.name === 'Favorites' ? favorites : selectedCategory.items).map((item, index) => (
                  <motion.div key={item.text} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <div className="relative">
                      <Button
                        className="h-24 w-full text-xl font-semibold bg-gradient-to-br from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl shadow-lg"
                        onClick={() => handleItemClick(item)}
                      >
                        {index + 1}. {item.text}
                      </Button>
                      {selectedCategory.name !== 'Favorites' && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-1 right-1 bg-white dark:bg-gray-800"
                          onClick={() => toggleFavorite(item)}
                          aria-label={favorites.some(f => f.text === item.text && f.phrase === item.phrase) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Star className={`h-4 w-4 ${favorites.some(f => f.text === item.text && f.phrase === item.phrase) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`} />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </>
            ) : (
              categories.map((category) => (
                <motion.div key={category.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="h-28 w-full text-2xl font-semibold bg-gradient-to-br from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white rounded-2xl shadow-lg"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.icon}
                    <span className="ml-3">{category.name}</span>
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}