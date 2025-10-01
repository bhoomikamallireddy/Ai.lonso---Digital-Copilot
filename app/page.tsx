"use client"

import { useState, useReducer } from "react"
import {
  Home,
  MessageCircle,
  Trophy,
  Video,
  Users,
  Send,
  Upload,
  Medal,
  Heart,
  Play,
  Crown,
  Target,
  Flame,
} from "lucide-react"

// Mock data
const mockUser = {
  id: "user_123",
  name: "F1 Fan",
  ranking: 42,
  points: 1250,
  badges: [
    { id: 1, name: "Race Prophet", icon: "🏆", earned: true },
    { id: 2, name: "Speed Demon", icon: "⚡", earned: true },
    { id: 3, name: "Pole Position", icon: "🥇", earned: false },
    { id: 4, name: "Fastest Lap", icon: "🏁", earned: true },
  ],
}

const mockLeaderboard = [
  { id: 1, name: "SpeedKing", points: 2100, rank: 1 },
  { id: 2, name: "F1Master", points: 1890, rank: 2 },
  { id: 3, name: "RaceGuru", points: 1675, rank: 3 },
  { id: 4, name: "F1 Fan", points: 1250, rank: 4 },
  { id: 5, name: "TurboFan", points: 1100, rank: 5 },
]

const mockReels = [
  { id: 1, title: "Alonso's Best Overtake", likes: 1200, thumbnail: "🏎️" },
  { id: 2, title: "Silverstone Magic", likes: 890, thumbnail: "🏁" },
  { id: 3, title: "Monaco Masterclass", likes: 2100, thumbnail: "🏆" },
]

const mockChatMessages = [
  { id: 1, user: "F1Master", message: "What do you think about the new regulations?", timestamp: "10:30" },
  {
    id: 2,
    user: "AI Alonso",
    message: "The new regulations bring exciting opportunities for wheel-to-wheel racing!",
    timestamp: "10:31",
    isAlonso: true,
  },
  { id: 3, user: "SpeedKing", message: "Can't wait for the next race!", timestamp: "10:32" },
]

// State reducer for complex state management
const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, currentView: action.payload }
    case "SET_CHAT_INPUT":
      return { ...state, chatInput: action.payload }
    case "ADD_CHAT_MESSAGE":
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
        chatInput: "",
      }
    case "SET_AVATAR_STATE":
      return { ...state, avatarState: action.payload }
    case "SET_TIME_ERA":
      return { ...state, selectedEra: action.payload }
    case "SET_PREDICTION":
      return {
        ...state,
        predictions: { ...state.predictions, [action.field]: action.value },
      }
    case "TOGGLE_REEL_LIKE":
      return {
        ...state,
        reels: state.reels.map((reel) =>
          reel.id === action.reelId
            ? { ...reel, likes: reel.liked ? reel.likes - 1 : reel.likes + 1, liked: !reel.liked }
            : reel,
        ),
      }
    default:
      return state
  }
}

const initialState = {
  currentView: "home",
  chatInput: "",
  chatMessages: mockChatMessages,
  avatarState: "idle", // idle, listening, thinking, speaking
  selectedEra: "2023-Present",
  predictions: {
    winner: "",
    fastestLap: "",
    polePosition: "",
  },
  reels: mockReels.map((reel) => ({ ...reel, liked: false })),
  uploadedFile: null,
  analysisPrompt: "",
}

// Avatar Component with Animation
const AlonsoAvatar = ({ state, size = "large" }) => {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-20 h-20",
    large: "w-32 h-32",
  }

  const getStateColor = () => {
    switch (state) {
      case "listening":
        return "text-blue-400"
      case "thinking":
        return "text-yellow-400"
      case "speaking":
        return "text-green-400"
      default:
        return "text-[#37D980]"
    }
  }

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      <div
        className={`w-full h-full rounded-full bg-gradient-to-br from-[#005F41] to-[#37D980] flex items-center justify-center ${state === "thinking" ? "helmet-spin" : ""} ${state === "listening" ? "pulse-green" : ""}`}
      >
        <div className={`text-4xl ${getStateColor()}`}>🏎️</div>
      </div>
      {state !== "idle" && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full">{state}</div>
        </div>
      )}
    </div>
  )
}

// Navigation Component
const Navigation = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "avatar", icon: MessageCircle, label: "Ask Alonso" },
    { id: "predictions", icon: Trophy, label: "Predictions" },
    { id: "reels", icon: Video, label: "Reels" },
    { id: "social", icon: Users, label: "Social" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#333333] z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentView === id ? "text-[#37D980] bg-[#005F41]/20" : "text-gray-400 hover:text-white"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// Home View Component
const HomeView = ({ user, onViewChange, dispatch }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#005F41]/20 p-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
          <p className="text-gray-400">Ready to race with AI Alonso?</p>
        </div>
        <div className="text-right">
          <div className="text-[#37D980] font-bold">Rank #{user.ranking}</div>
          <div className="text-gray-400 text-sm">{user.points} pts</div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#005F41] to-[#37D980]/20 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">AI Alonso</h2>
            <p className="text-gray-300 text-sm mb-4">Your F1 companion is ready</p>
            <button
              onClick={() => onViewChange("avatar")}
              className="bg-[#37D980] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#37D980]/90 transition-colors"
            >
              Ask Alonso
            </button>
          </div>
          <AlonsoAvatar state="idle" size="medium" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#333333]">
          <div className="flex items-center mb-2">
            <Trophy className="text-[#37D980] mr-2" size={20} />
            <span className="text-gray-400 text-sm">Current Prediction</span>
          </div>
          <div className="text-white font-semibold">Verstappen Win</div>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#333333]">
          <div className="flex items-center mb-2">
            <Medal className="text-[#37D980] mr-2" size={20} />
            <span className="text-gray-400 text-sm">Badges Earned</span>
          </div>
          <div className="text-white font-semibold">{user.badges.filter((b) => b.earned).length}/4</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <button
          onClick={() => onViewChange("predictions")}
          className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-left hover:border-[#37D980]/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Make Predictions</div>
              <div className="text-gray-400 text-sm">Earn badges and climb the leaderboard</div>
            </div>
            <Target className="text-[#37D980]" size={20} />
          </div>
        </button>

        <button
          onClick={() => onViewChange("social")}
          className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-left hover:border-[#37D980]/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Join Social Space</div>
              <div className="text-gray-400 text-sm">Chat with fellow F1 fans</div>
            </div>
            <Users className="text-[#37D980]" size={20} />
          </div>
        </button>
      </div>
    </div>
  )
}

// Avatar Chat View Component
const AvatarView = ({ state, dispatch }) => {
  const [streamingMessage, setStreamingMessage] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)

  const eras = ["2003-2006 Renault", "2010-2014 Ferrari", "2023-Present Aston Martin"]

  const handleSendMessage = async () => {
    if (!state.chatInput.trim()) return

    const userMessage = {
      id: Date.now(),
      user: "You",
      message: state.chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
    }

    dispatch({ type: "ADD_CHAT_MESSAGE", payload: userMessage })
    dispatch({ type: "SET_AVATAR_STATE", payload: "thinking" })

    // Simulate AI response with streaming
    setTimeout(() => {
      dispatch({ type: "SET_AVATAR_STATE", payload: "speaking" })
      setIsStreaming(true)

      const responses = [
        "That's a great question! From my experience in Formula 1...",
        "You know, racing has taught me that every corner is an opportunity...",
        "In my years with Ferrari, Renault, and now Aston Martin, I've learned...",
        "The key to success in F1 is consistency and never giving up...",
      ]

      const response = responses[Math.floor(Math.random() * responses.length)]
      let currentText = ""

      const streamInterval = setInterval(() => {
        if (currentText.length < response.length) {
          currentText += response[currentText.length]
          setStreamingMessage(currentText)
        } else {
          clearInterval(streamInterval)
          setIsStreaming(false)

          const alonsoMessage = {
            id: Date.now() + 1,
            user: "AI Alonso",
            message: response,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isAlonso: true,
          }

          dispatch({ type: "ADD_CHAT_MESSAGE", payload: alonsoMessage })
          dispatch({ type: "SET_AVATAR_STATE", payload: "idle" })
          setStreamingMessage("")
        }
      }, 50)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col pb-20">
      {/* Header */}
      <div className="bg-[#1A1A1A] border-b border-[#333333] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlonsoAvatar state={state.avatarState} size="small" />
            <div className="ml-3">
              <h2 className="text-white font-semibold">AI Alonso</h2>
              <p className="text-gray-400 text-sm">{state.selectedEra}</p>
            </div>
          </div>
          <select
            value={state.selectedEra}
            onChange={(e) => dispatch({ type: "SET_TIME_ERA", payload: e.target.value })}
            className="bg-[#2A2A2A] text-white border border-[#333333] rounded-lg px-3 py-1 text-sm"
          >
            {eras.map((era) => (
              <option key={era} value={era}>
                {era}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.chatMessages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.isUser
                  ? "bg-[#37D980] text-black"
                  : message.isAlonso
                    ? "bg-[#005F41] text-white border border-[#37D980]/30"
                    : "bg-[#2A2A2A] text-white"
              }`}
            >
              {!message.isUser && <div className="text-xs opacity-70 mb-1">{message.user}</div>}
              <div>{message.message}</div>
              <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-[#005F41] text-white border border-[#37D980]/30 rounded-2xl p-3">
              <div className="text-xs opacity-70 mb-1">AI Alonso</div>
              <div>
                {streamingMessage}
                <span className="animate-pulse">|</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#1A1A1A] border-t border-[#333333]">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={state.chatInput}
            onChange={(e) => dispatch({ type: "SET_CHAT_INPUT", payload: e.target.value })}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask Alonso anything..."
            className="flex-1 bg-[#2A2A2A] text-white border border-[#333333] rounded-full px-4 py-2 focus:outline-none focus:border-[#37D980]"
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#37D980] text-black p-2 rounded-full hover:bg-[#37D980]/90 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Predictions View Component
const PredictionsView = ({ state, dispatch }) => {
  const handlePredictionChange = (field, value) => {
    dispatch({ type: "SET_PREDICTION", field, value })
  }

  const drivers = ["Verstappen", "Hamilton", "Leclerc", "Alonso", "Russell", "Norris", "Piastri", "Sainz"]

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Race Predictions</h1>
        <p className="text-gray-400">Make your predictions and earn badges!</p>
      </div>

      {/* Prediction Form */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-6 border border-[#333333]">
        <h2 className="text-xl font-semibold text-white mb-4">Next Race: Abu Dhabi GP</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Race Winner</label>
            <select
              value={state.predictions.winner}
              onChange={(e) => handlePredictionChange("winner", e.target.value)}
              className="w-full bg-[#2A2A2A] text-white border border-[#333333] rounded-lg px-3 py-2"
            >
              <option value="">Select driver...</option>
              {drivers.map((driver) => (
                <option key={driver} value={driver}>
                  {driver}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Fastest Lap</label>
            <select
              value={state.predictions.fastestLap}
              onChange={(e) => handlePredictionChange("fastestLap", e.target.value)}
              className="w-full bg-[#2A2A2A] text-white border border-[#333333] rounded-lg px-3 py-2"
            >
              <option value="">Select driver...</option>
              {drivers.map((driver) => (
                <option key={driver} value={driver}>
                  {driver}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Pole Position</label>
            <select
              value={state.predictions.polePosition}
              onChange={(e) => handlePredictionChange("polePosition", e.target.value)}
              className="w-full bg-[#2A2A2A] text-white border border-[#333333] rounded-lg px-3 py-2"
            >
              <option value="">Select driver...</option>
              {drivers.map((driver) => (
                <option key={driver} value={driver}>
                  {driver}
                </option>
              ))}
            </select>
          </div>

          <button className="w-full bg-[#37D980] text-black py-3 rounded-lg font-semibold hover:bg-[#37D980]/90 transition-colors">
            Submit Predictions
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Your Badges</h2>
        <div className="grid grid-cols-2 gap-3">
          {mockUser.badges.map((badge) => (
            <div
              key={badge.id}
              className={`bg-[#1A1A1A] rounded-xl p-4 border ${badge.earned ? "border-[#37D980]" : "border-[#333333]"}`}
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <div className={`font-semibold ${badge.earned ? "text-[#37D980]" : "text-gray-400"}`}>{badge.name}</div>
              <div className="text-xs text-gray-500 mt-1">{badge.earned ? "Earned" : "Not earned"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Live Leaderboard</h2>
        <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden">
          {mockLeaderboard.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-4 ${index < mockLeaderboard.length - 1 ? "border-b border-[#333333]" : ""}`}
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    user.rank === 1
                      ? "bg-yellow-500"
                      : user.rank === 2
                        ? "bg-gray-400"
                        : user.rank === 3
                          ? "bg-orange-600"
                          : "bg-[#2A2A2A]"
                  }`}
                >
                  <span className="text-sm font-bold">{user.rank}</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{user.name}</div>
                  <div className="text-gray-400 text-sm">{user.points} points</div>
                </div>
              </div>
              {user.rank <= 3 && <Crown className="text-[#37D980]" size={20} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Reels View Component
const ReelsView = ({ state, dispatch }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Mock file upload
      console.log("File uploaded:", file.name)
    }
  }

  const toggleLike = (reelId) => {
    dispatch({ type: "TOGGLE_REEL_LIKE", reelId })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Reel Analyzer</h1>
        <p className="text-gray-400">Create and analyze F1 content</p>
      </div>

      {/* Upload Section */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-6 border border-[#333333]">
        <h2 className="text-xl font-semibold text-white mb-4">Upload Your Reel</h2>

        <div className="border-2 border-dashed border-[#333333] rounded-xl p-8 text-center mb-4 hover:border-[#37D980]/50 transition-colors">
          <Upload className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-400 mb-4">Drag and drop your video here, or click to browse</p>
          <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" id="video-upload" />
          <label
            htmlFor="video-upload"
            className="bg-[#37D980] text-black px-6 py-2 rounded-lg font-semibold cursor-pointer hover:bg-[#37D980]/90 transition-colors"
          >
            Choose File
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">What-if Scenario Prompt</label>
          <textarea
            placeholder="e.g., What if Alonso had stayed at Ferrari in 2015?"
            className="w-full bg-[#2A2A2A] text-white border border-[#333333] rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:border-[#37D980]"
          />
        </div>

        <button className="w-full bg-[#37D980] text-black py-3 rounded-lg font-semibold hover:bg-[#37D980]/90 transition-colors">
          Analyze Reel
        </button>
      </div>

      {/* Analysis Results */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-6 border border-[#333333]">
        <h2 className="text-xl font-semibold text-white mb-4">Analysis Results</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-[#37D980] font-semibold mb-2">Suggested Caption</h3>
            <p className="text-gray-300">
              "Incredible wheel-to-wheel action! This is why we love F1 🏎️ #Formula1 #Racing"
            </p>
          </div>

          <div>
            <h3 className="text-[#37D980] font-semibold mb-2">Recommended Hashtags</h3>
            <div className="flex flex-wrap gap-2">
              {["#F1", "#Formula1", "#Racing", "#Motorsport", "#Speed", "#Adrenaline"].map((tag) => (
                <span key={tag} className="bg-[#2A2A2A] text-[#37D980] px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[#37D980] font-semibold mb-2">Sentiment Analysis</h3>
            <div className="bg-[#2A2A2A] rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Excitement</span>
                <span className="text-white">92%</span>
              </div>
              <div className="w-full bg-[#333333] rounded-full h-2">
                <div className="bg-[#37D980] h-2 rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reel Showcase */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Trending Reels</h2>
        <div className="space-y-4">
          {state.reels.map((reel) => (
            <div key={reel.id} className="bg-[#1A1A1A] rounded-xl border border-[#333333] overflow-hidden">
              <div className="aspect-video bg-[#2A2A2A] flex items-center justify-center relative">
                <div className="text-6xl">{reel.thumbnail}</div>
                <button className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-colors">
                  <Play className="text-white" size={48} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">{reel.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(reel.id)}
                      className={`flex items-center space-x-1 ${reel.liked ? "text-red-500" : "text-gray-400"} hover:text-red-500 transition-colors`}
                    >
                      <Heart size={20} fill={reel.liked ? "currentColor" : "none"} />
                      <span>{reel.likes}</span>
                    </button>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Flame size={16} className="mr-1" />
                    <span className="text-sm">Trending</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Social View Component
const SocialView = ({ state, dispatch }) => {
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      user: mockUser.name,
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
    }

    dispatch({ type: "ADD_CHAT_MESSAGE", payload: message })
    setNewMessage("")
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col pb-20">
      {/* Header */}
      <div className="bg-[#1A1A1A] border-b border-[#333333] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">F1 Social Space</h1>
            <p className="text-gray-400 text-sm">
              Connected as: {mockUser.name} (ID: {mockUser.id})
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#37D980] rounded-full animate-pulse"></div>
            <span className="text-[#37D980] text-sm">Live</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.chatMessages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.isUser
                  ? "bg-[#37D980] text-black"
                  : message.isAlonso
                    ? "bg-gradient-to-r from-[#005F41] to-[#37D980]/20 text-white border border-[#37D980]/50"
                    : "bg-[#2A2A2A] text-white"
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="text-xs opacity-70">{message.user}</span>
                {message.isAlonso && (
                  <div className="ml-2 bg-[#37D980] text-black text-xs px-2 py-0.5 rounded-full">Premium AI</div>
                )}
              </div>
              <div>{message.message}</div>
              <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#1A1A1A] border-t border-[#333333]">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Chat with F1 fans..."
            className="flex-1 bg-[#2A2A2A] text-white border border-[#333333] rounded-full px-4 py-2 focus:outline-none focus:border-[#37D980]"
          />
          <button
            onClick={sendMessage}
            className="bg-[#37D980] text-black p-2 rounded-full hover:bg-[#37D980]/90 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">🔴 WebSocket connected • Real-time chat active</div>
      </div>
    </div>
  )
}

// Main App Component
export default function AstonMartinF1App() {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const handleViewChange = (view) => {
    dispatch({ type: "SET_VIEW", payload: view })
  }

  const renderCurrentView = () => {
    switch (state.currentView) {
      case "home":
        return <HomeView user={mockUser} onViewChange={handleViewChange} dispatch={dispatch} />
      case "avatar":
        return <AvatarView state={state} dispatch={dispatch} />
      case "predictions":
        return <PredictionsView state={state} dispatch={dispatch} />
      case "reels":
        return <ReelsView state={state} dispatch={dispatch} />
      case "social":
        return <SocialView state={state} dispatch={dispatch} />
      default:
        return <HomeView user={mockUser} onViewChange={handleViewChange} dispatch={dispatch} />
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {renderCurrentView()}
      <Navigation currentView={state.currentView} onViewChange={handleViewChange} />
    </div>
  )
}
