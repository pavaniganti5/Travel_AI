import { useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Headphones,
  MapPin,
  Mic,
  Plus,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'
import { travelApi } from './api/travelApi'
import './App.css'

const POPULAR_DESTINATIONS = [
  {
    id: 'goa',
    emoji: '🌴',
    city: 'Goa',
    country: 'India',
    fullName: 'Goa, India',
    region: 'THE WEST COAST, INDIA',
    tagline: 'Goa, at your own pace.',
    subtitle: 'Salt air. Slow mornings. Long lunches.',
    defaultOrigin: 'Hyderabad, India',
    defaultBudget: 30000,
    startDate: '2026-11-14',
    endDate: '2026-11-18',
    currency: 'INR',
    interests: ['Beaches', 'Food'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85',
    alt: 'Palm-lined beach and Arabian Sea in Goa',
    sampleTrip: {
      title: 'A Goa weekend, unhurried.',
      days: 5,
      budget: '₹28,500',
      travelers: '2 travelers',
      highlights: [
        { day: 'DAY 01', date: '14 NOV', title: 'Find your feet', desc: 'Check in, then let the afternoon drift by at Palolem Beach.', tags: 'MORNING · BEACH · SUNSET' },
        { day: 'DAY 02', date: '15 NOV', title: 'Old Goa, new stories', desc: 'Portuguese-era lanes, a long local lunch, and Fontainhas at dusk.', tags: 'HERITAGE · FOOD · CULTURE' },
        { day: 'DAY 03', date: '16 NOV', title: 'Take the scenic way', desc: 'A quiet morning market followed by a tucked-away cove.', tags: 'MARKET · COAST · SLOW DOWN' },
      ]
    }
  },
  {
    id: 'tokyo',
    emoji: '🗼',
    city: 'Tokyo',
    country: 'Japan',
    fullName: 'Tokyo, Japan',
    region: 'KANTO REGION, JAPAN',
    tagline: 'Tokyo, past and future in one breath.',
    subtitle: 'Neon corridors. Quiet shrines. World-class ramen.',
    defaultOrigin: 'Delhi, India',
    defaultBudget: 180000,
    startDate: '2026-10-10',
    endDate: '2026-10-16',
    currency: 'INR',
    interests: ['Culture', 'Food', 'Adventure'],
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1400&q=85',
    alt: 'Tokyo Tower and skyline illuminated at dusk',
    sampleTrip: {
      title: 'Tokyo: Temples, Neon & Gastronomy',
      days: 6,
      budget: '₹1,75,000',
      travelers: '2 travelers',
      highlights: [
        { day: 'DAY 01', date: '10 OCT', title: 'Asakusa & Ancient Echoes', desc: 'Senso-ji Temple at dawn followed by street snacks along Nakamise.', tags: 'TEMPLE · STREET FOOD · HERITAGE' },
        { day: 'DAY 02', date: '11 OCT', title: 'Shibuya Crossing & Harajuku', desc: 'Famous scramble crossing, Meiji Shrine forest, and omakase dinner.', tags: 'MODERN · FASHION · CULINARY' },
        { day: 'DAY 03', date: '12 OCT', title: 'Akihabara & TeamLab Planets', desc: 'Immersive digital art exhibits and anime culture exploration.', tags: 'ART · TECHNOLOGY · NIGHTLIFE' },
      ]
    }
  },
  {
    id: 'paris',
    emoji: '🥐',
    city: 'Paris',
    country: 'France',
    fullName: 'Paris, France',
    region: 'ÎLE-DE-FRANCE, FRANCE',
    tagline: 'Paris, romance along the Seine.',
    subtitle: 'Cobblestone cafes. Louvre masterpieces. Golden hour rooftops.',
    defaultOrigin: 'Mumbai, India',
    defaultBudget: 195000,
    startDate: '2026-05-05',
    endDate: '2026-05-10',
    currency: 'INR',
    interests: ['Culture', 'Food', 'Nature'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=85',
    alt: 'Eiffel Tower and charming Parisian streets',
    sampleTrip: {
      title: 'Parisian Charm & Artful Days',
      days: 5,
      budget: '₹1,90,000',
      travelers: '2 travelers',
      highlights: [
        { day: 'DAY 01', date: '05 MAY', title: 'Montmartre & Sacré-Cœur', desc: 'Bohemian lanes, artists square, and sunset overlooking Paris.', tags: 'PANORAMA · CAFES · ART' },
        { day: 'DAY 02', date: '06 MAY', title: 'Louvre & Seine River Cruise', desc: 'Mona Lisa, Tuileries gardens stroll, and evening Seine cruise.', tags: 'MUSEUM · RIVER · ARCHITECTURE' },
        { day: 'DAY 03', date: '07 MAY', title: 'Le Marais & Latin Quarter', desc: 'Vintage boutiques, artisanal patisseries, and historic bookshops.', tags: 'FOOD · BOUTIQUES · LITERARY' },
      ]
    }
  },
  {
    id: 'jaipur',
    emoji: '🏰',
    city: 'Jaipur',
    country: 'India',
    fullName: 'Jaipur, India',
    region: 'RAJASTHAN, INDIA',
    tagline: 'Jaipur, the Royal Pink Citadel.',
    subtitle: 'Amber Fort vistas. Hawa Mahal breezes. Royal thalis.',
    defaultOrigin: 'Delhi, India',
    defaultBudget: 25000,
    startDate: '2026-11-20',
    endDate: '2026-11-24',
    currency: 'INR',
    interests: ['Culture', 'Food', 'Nature'],
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=85',
    alt: 'Hawa Mahal Palace in Jaipur Rajasthan',
    sampleTrip: {
      title: 'Royal Grandeur in the Pink City',
      days: 4,
      budget: '₹24,000',
      travelers: '2 travelers',
      highlights: [
        { day: 'DAY 01', date: '20 NOV', title: 'Amer Fort & Stepwells', desc: 'Elephant paths, intricate mirror work at Sheesh Mahal, and Panna Meena Kund.', tags: 'FORT · PALACE · PHOTOGRAPHY' },
        { day: 'DAY 02', date: '21 NOV', title: 'City Palace & Old Bazaars', desc: 'Royal courtyards, Johari Bazaar jewelry, and authentic Dal Baati Churma.', tags: 'CRAFT · BAZAARS · TRADITION' },
        { day: 'DAY 03', date: '22 NOV', title: 'Nahargarh Sunset & Local Crafts', desc: 'Sunset overlooking the Pink City skyline followed by puppet shows and folk music.', tags: 'SUNSET · MUSIC · CULTURE' },
      ]
    }
  },
  {
    id: 'bali',
    emoji: '🌺',
    city: 'Bali',
    country: 'Indonesia',
    fullName: 'Bali, Indonesia',
    region: 'LESSER SUNDA ISLANDS, INDONESIA',
    tagline: 'Bali, where jungle meets the reef.',
    subtitle: 'Ubud rice terraces. Cliffside temples. Sun-kissed surf.',
    defaultOrigin: 'Bengaluru, India',
    defaultBudget: 85000,
    startDate: '2026-12-12',
    endDate: '2026-12-18',
    currency: 'INR',
    interests: ['Nature', 'Beaches', 'Adventure'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85',
    alt: 'Uluwatu cliff and ocean in Bali',
    sampleTrip: {
      title: 'Tropical Serenity in Bali',
      days: 6,
      budget: '₹82,000',
      travelers: '2 travelers',
      highlights: [
        { day: 'DAY 01', date: '12 DEC', title: 'Ubud Cascades & Monkey Forest', desc: 'Tegallalang rice terraces, sacred monkey forest, and organic farm dining.', tags: 'JUNGLE · RICE FIELDS · RELAX' },
        { day: 'DAY 02', date: '13 DEC', title: 'Mount Batur Sunrise & Hot Springs', desc: 'Early dawn trek for volcanic sunrise followed by soothing natural hot springs.', tags: 'TREKKING · SUNRISE · WELLNESS' },
        { day: 'DAY 03', date: '14 DEC', title: 'Uluwatu Sunset & Kecak Dance', desc: 'Cliff-edge temple vistas, dramatic fire dance at dusk, and seafood barbecue in Jimbaran.', tags: 'CLIFF · SUNSET · SEAFOOD' },
      ]
    }
  },
  {
    id: 'dubai',
    emoji: '🏙️',
    city: 'Dubai',
    country: 'UAE',
    fullName: 'Dubai, UAE',
    region: 'ARABIAN GULF, UAE',
    tagline: 'Dubai, futuristic dreams in the desert.',
    subtitle: 'Burj Khalifa heights. Red dune safaris. Marina sunsets.',
    defaultOrigin: 'Hyderabad, India',
    defaultBudget: 110000,
    startDate: '2027-01-18',
    endDate: '2027-01-23',
    currency: 'INR',
    interests: ['Adventure', 'Food', 'Culture'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=85',
    alt: 'Dubai Marina and futuristic skyline',
    sampleTrip: {
      title: 'Glamour, Dunes & Skyline in Dubai',
      days: 5,
      budget: '₹1,05,000',
      travelers: '2 travelers',
      highlights: [
        { day: 'DAY 01', date: '18 JAN', title: 'Downtown & Burj Khalifa', desc: 'At the Top observation deck, Dubai Mall fountain show, and waterfront dining.', tags: 'SKYLINE · SHOPPING · SPECTACLE' },
        { day: 'DAY 02', date: '19 JAN', title: 'Desert Safari & Bedouin Camp', desc: '4x4 dune bashing, camel riding, falconry, and star-lit barbecue feast.', tags: 'DESERT · ADVENTURE · BBQ' },
        { day: 'DAY 03', date: '20 JAN', title: 'Old Dubai & Gold Souk', desc: 'Abra boat ride on Dubai Creek, spice souk aromatics, and Emirati heritage lunch.', tags: 'HERITAGE · CREEK · SOUK' },
      ]
    }
  },
  {
    id: 'manali',
    emoji: '🏔️',
    city: 'Manali',
    country: 'India',
    fullName: 'Manali, India',
    region: 'HIMACHAL PRADESH, INDIA',
    tagline: 'Manali, crisp mountain air & pine valleys.',
    subtitle: 'Snow peaks. Solang adventure. Cozy riverside cafes.',
    defaultOrigin: 'Chandigarh, India',
    defaultBudget: 22000,
    startDate: '2026-12-10',
    endDate: '2026-12-14',
    currency: 'INR',
    interests: ['Nature', 'Adventure', 'Food'],
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85',
    alt: 'Himalayan snow mountains in Manali Himachal Pradesh',
    sampleTrip: {
      title: 'Himalayan Escape in Manali',
      days: 4,
      budget: '₹21,500',
      travelers: '2 travelers',
      highlights: [
        { day: 'DAY 01', date: '10 DEC', title: 'Old Manali & Hadimba Temple', desc: 'Cedar forest trails, ancient wooden architecture, and riverside trout cafes.', tags: 'FOREST · HERITAGE · CAFE' },
        { day: 'DAY 02', date: '11 DEC', title: 'Solang Valley & Atal Tunnel', desc: 'Paragliding, snow valley viewpoints, and driving across to Lahaul valley.', tags: 'SNOW · ADVENTURE · MOUNTAINS' },
        { day: 'DAY 03', date: '12 DEC', title: 'Jogini Waterfalls & Vashisht Baths', desc: 'Pine-shaded waterfall trek and soothing natural sulphur hot springs.', tags: 'WATERFALL · TREK · NATURE' },
      ]
    }
  },
  {
    id: 'rome',
    emoji: '🏛️',
    city: 'Rome',
    country: 'Italy',
    fullName: 'Rome, Italy',
    region: 'LAZIO, ITALY',
    tagline: 'Rome, the Eternal City.',
    subtitle: 'Colosseum gladiators. Trastevere trattorias. Trevi wishes.',
    defaultOrigin: 'Delhi, India',
    defaultBudget: 175000,
    startDate: '2027-04-15',
    endDate: '2027-04-20',
    currency: 'INR',
    interests: ['Culture', 'Food', 'Nature'],
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1400&q=85',
    alt: 'Colosseum and Roman forum at sunset',
    sampleTrip: {
      title: 'Antiquity & La Dolce Vita in Rome',
      days: 5,
      budget: '₹1,70,000',
      travelers: '2 travelers',
      highlights: [
        { day: 'DAY 01', date: '15 APR', title: 'Colosseum & Roman Forum', desc: 'Walk in the footsteps of emperors, Palatine Hill, and authentic carbonara.', tags: 'ANCIENT · MONUMENTS · PASTA' },
        { day: 'DAY 02', date: '16 APR', title: 'Vatican Museums & St. Peter’s', desc: 'Sistine Chapel frescoes, St. Peter’s dome view, and gelato in Prati.', tags: 'ART · VATICAN · GELATO' },
        { day: 'DAY 03', date: '17 APR', title: 'Trevi Fountain & Trastevere', desc: 'Coin toss at Trevi, Pantheon marvel, and twilight piazza aperitivo in Trastevere.', tags: 'PIAZZA · WINE · AMBIANCE' },
      ]
    }
  }
]

const VOICE_SUGGESTIONS = [
  { text: 'Plan a 5-day Goa trip for two under ₹30,000', city: 'Goa, India' },
  { text: 'Plan a 6-day Tokyo adventure with sushi and temples under ₹1,80,000', city: 'Tokyo, Japan' },
  { text: 'Plan a 5-day romantic Paris getaway with art & cafes under ₹1,95,000', city: 'Paris, France' },
  { text: 'Plan a 4-day Jaipur royal heritage tour under ₹25,000', city: 'Jaipur, India' },
  { text: 'Plan a 6-day Bali wellness and beach retreat under ₹85,000', city: 'Bali, Indonesia' },
  { text: 'Plan a 5-day Dubai desert safari and skyline trip under ₹1,10,000', city: 'Dubai, UAE' },
  { text: 'Plan a 4-day Manali snow mountain escape under ₹22,000', city: 'Manali, India' },
  { text: 'Plan a 5-day Rome history & culinary journey under ₹1,75,000', city: 'Rome, Italy' }
]

function App() {
  const [selectedDestIndex, setSelectedDestIndex] = useState(0)
  const [sampleCityIndex, setSampleCityIndex] = useState(0)
  const [mode, setMode] = useState('text')
  const [destination, setDestination] = useState(POPULAR_DESTINATIONS[0].fullName)
  const [origin, setOrigin] = useState(POPULAR_DESTINATIONS[0].defaultOrigin)
  const [budget, setBudget] = useState(POPULAR_DESTINATIONS[0].defaultBudget)
  const [startDate, setStartDate] = useState(POPULAR_DESTINATIONS[0].startDate)
  const [endDate, setEndDate] = useState(POPULAR_DESTINATIONS[0].endDate)
  const [interests, setInterests] = useState(POPULAR_DESTINATIONS[0].interests)
  const [request, setRequest] = useState('')
  const [recognizedRequest, setRecognizedRequest] = useState('')
  const [voiceStatus, setVoiceStatus] = useState('idle')
  const [trip, setTrip] = useState(null)
  const [savedTrips, setSavedTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [saving, setSaving] = useState(false)
  const [busyDay, setBusyDay] = useState(null)
  const [audioSource, setAudioSource] = useState('')
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [modification, setModification] = useState('')
  const [showSavedTrips, setShowSavedTrips] = useState(false)

  const interestOptions = ['Beaches', 'Food', 'Nature', 'Culture', 'Adventure']

  const activeDest = POPULAR_DESTINATIONS[selectedDestIndex] || POPULAR_DESTINATIONS[0]
  const activeSample = POPULAR_DESTINATIONS[sampleCityIndex] || POPULAR_DESTINATIONS[0]

  const money = (amount, currency = trip?.currency || 'INR') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0)

  function handleSelectCity(index) {
    const dest = POPULAR_DESTINATIONS[index]
    if (!dest) return
    setSelectedDestIndex(index)
    setSampleCityIndex(index)
    setDestination(dest.fullName)
    setOrigin(dest.defaultOrigin)
    setBudget(dest.defaultBudget)
    setStartDate(dest.startDate)
    setEndDate(dest.endDate)
    setInterests(dest.interests)
  }

  function handlePrevDest() {
    const newIdx = (selectedDestIndex - 1 + POPULAR_DESTINATIONS.length) % POPULAR_DESTINATIONS.length
    handleSelectCity(newIdx)
  }

  function handleNextDest() {
    const newIdx = (selectedDestIndex + 1) % POPULAR_DESTINATIONS.length
    handleSelectCity(newIdx)
  }

  function toggleInterest(item) {
    setInterests((selected) => selected.includes(item)
      ? selected.filter((value) => value !== item)
      : [...selected, item])
  }

  function applyVoiceSuggestion(item) {
    setRequest(item.text)
    setRecognizedRequest(item.text)
    const matchingIdx = POPULAR_DESTINATIONS.findIndex((d) => d.fullName.toLowerCase() === item.city.toLowerCase())
    if (matchingIdx !== -1) {
      handleSelectCity(matchingIdx)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const requestText = mode === 'voice' ? recognizedRequest.trim() : request.trim()
    if (mode === 'voice' && !requestText) {
      setError('Record a request before planning your trip.')
      return
    }

    const payload = {
      origin: origin.trim(),
      destination: destination.trim(),
      start_date: fields.get('start_date') || startDate,
      end_date: fields.get('end_date') || endDate,
      travelers: Number(fields.get('travelers') || 2),
      budget: Number(fields.get('budget') || budget),
      currency: 'INR',
      interests,
      travel_style: fields.get('travel_style') || 'A little of everything',
      activity_level: fields.get('activity_level') || 'Balanced',
      food_preferences: [fields.get('food_preferences') || 'Local Cuisine'],
    }

    if (mode === 'voice') payload.request_text = requestText
    else payload.additional_request = requestText || null

    setLoading(true)
    setError('')
    setStatusMessage('Planning your trip...')
    setTrip(null)
    setAudioSource('')
    try {
      const result = mode === 'voice'
        ? await travelApi.planFromVoice(payload)
        : await travelApi.planTrip(payload)
      setTrip(result)
      setStatusMessage('Your itinerary is ready.')
      window.setTimeout(() => document.getElementById('trip-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    } catch (requestError) {
      setStatusMessage('')
      setError(requestError.response?.data?.detail || requestError.message || 'Could not plan this trip. Check the API connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  function startVoiceRequest() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition) {
      setError('Speech recognition is not available in this browser. You can write your request instead.')
      return
    }

    const recognition = new Recognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => {
      setVoiceStatus('recording')
      setError('')
    }
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim()
      setRecognizedRequest(transcript)
      setRequest(transcript)
      setVoiceStatus('recognized')
    }
    recognition.onerror = () => {
      setVoiceStatus('idle')
      setError('We could not recognize that request. Please try again or type it instead.')
    }
    recognition.onend = () => {
      setVoiceStatus((current) => current === 'recording' ? 'idle' : current)
    }
    recognition.start()
  }

  async function handleSpeak() {
    if (!trip) return
    setSpeaking(true)
    setError('')
    const narration = [
      `${trip.destination}, ${trip.duration_days} days.`,
      trip.trip_summary,
      `Estimated total: ${money(trip.estimated_total_budget)}.`,
      ...trip.day_by_day_itinerary.map((day) => `Day ${day.day_number}, ${day.title}. ${day.notes?.[0] || ''}`),
    ].filter(Boolean).join(' ')
    try {
      const result = await travelApi.speak(narration)
      setAudioSource(result.audio_data
        ? `data:${result.audio_mime_type || 'audio/mpeg'};base64,${result.audio_data}`
        : result.audio_url)
      setStatusMessage('Your spoken itinerary is ready.')
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Speech is unavailable right now. Your itinerary is still here as text.')
    } finally {
      setSpeaking(false)
    }
  }

  async function handleModify(event) {
    event.preventDefault()
    if (!trip || !modification.trim()) return
    setLoading(true)
    setError('')
    setStatusMessage('Updating your itinerary...')
    try {
      const updated = await travelApi.modifyTrip({
        trip_id: trip.id,
        current_trip: trip,
        modification_instruction: modification.trim(),
      })
      setTrip({ ...updated, id: updated.id || trip.id, is_saved: trip.is_saved })
      setModification('')
      setStatusMessage('Your itinerary has been updated.')
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Could not update this itinerary.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegenerateDay(dayNumber) {
    if (!trip) return
    setBusyDay(dayNumber)
    setError('')
    try {
      const updated = await travelApi.regenerateDay({ trip_id: trip.id, trip_context: trip, day_number: dayNumber })
      setTrip({ ...updated, id: updated.id || trip.id, is_saved: trip.is_saved })
      setStatusMessage(`Day ${dayNumber} has been refreshed.`)
    } catch (requestError) {
      setError(requestError.response?.data?.detail || `Could not regenerate day ${dayNumber}.`)
    } finally {
      setBusyDay(null)
    }
  }

  async function handleSaveTrip() {
    if (!trip) return
    setSaving(true)
    setError('')
    try {
      await travelApi.saveTrip({ trip_data: trip, title: `${trip.duration_days}-Day Trip to ${trip.destination}` })
      setTrip((current) => ({ ...current, is_saved: true }))
      setStatusMessage('Trip saved to your collection.')
      const saved = await travelApi.getSavedTrips()
      setSavedTrips(saved)
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Could not save this trip.')
    } finally {
      setSaving(false)
    }
  }

  async function loadSavedTrips() {
    setShowSavedTrips((show) => !show)
    if (savedTrips.length) return
    try {
      setSavedTrips(await travelApi.getSavedTrips())
    } catch {
      setError('Saved trips are unavailable. Check that the API is running.')
    }
  }

  return (
    <div className="travel-app">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="TravelAI home">
          <span className="brand-mark"><Compass size={20} strokeWidth={2.1} /></span>
          <span>travel<span className="brand-ai">ai</span></span>
          <span className="brand-badge">AI 2.0</span>
        </a>
        <nav className="top-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#planner">Plan a trip</a>
          <button className="nav-link nav-button" onClick={loadSavedTrips} type="button">
            My trips
            {savedTrips.length > 0 && <span className="saved-counter">{savedTrips.length}</span>}
          </button>
        </nav>
        <button className="profile-button" type="button" aria-label="Traveler profile">P</button>
      </header>

      <main id="top" className="page-shell">
        <section className="intro-row">
          <div className="intro-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER STARTS HERE</p>
            <h1>Somewhere<br /><span>good is calling.</span></h1>
            <p className="intro-description">Thoughtful multi-city journeys across India and the globe, shaped around how you want to feel.</p>
          </div>
          <article className="destination-feature" aria-label={`Featured destination: ${activeDest.city}`}>
            <img
              src={activeDest.image}
              alt={activeDest.alt}
              key={activeDest.id}
            />
            <div className="feature-topline">
              <span><span className="feature-dot" /> ON THE RADAR</span>
              <ArrowDownRight size={17} />
            </div>
            <div className="feature-nav-buttons">
              <button className="feature-nav-btn" onClick={handlePrevDest} type="button" aria-label="Previous destination">
                <ChevronLeft size={16} />
              </button>
              <button className="feature-nav-btn" onClick={handleNextDest} type="button" aria-label="Next destination">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="feature-caption">
              <p>{activeDest.region}</p>
              <h2>{activeDest.tagline}</h2>
              <span>{activeDest.subtitle}</span>
            </div>
          </article>
        </section>

        <section id="planner" className="planner-section">
          <div className="city-selector-bar">
            <div className="city-selector-header">
              <span className="eyebrow">POPULAR DESTINATIONS</span>
              <span className="step-count">{POPULAR_DESTINATIONS.length} CITIES AVAILABLE</span>
            </div>
            <div className="city-pills" role="tablist" aria-label="Popular destinations">
              {POPULAR_DESTINATIONS.map((d, idx) => (
                <button
                  key={d.id}
                  className={`city-pill ${selectedDestIndex === idx ? 'active' : ''}`}
                  onClick={() => handleSelectCity(idx)}
                  type="button"
                >
                  <span className="city-pill-emoji">{d.emoji}</span>
                  <span>{d.city}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="section-heading">
            <div>
              <p className="eyebrow">A LITTLE ABOUT YOUR TRIP</p>
              <h2>Let's make a plan</h2>
            </div>
            <span className="step-count"><span>01</span> / 02</span>
          </div>

          <form className="planner-form" onSubmit={handleSubmit}>
            <div className="route-fields">
              <label className="field-block">
                <span className="field-label"><MapPin size={14} /> STARTING FROM</span>
                <input value={origin} onChange={(event) => setOrigin(event.target.value)} aria-label="Starting location" required />
              </label>
              <span className="route-arrow"><ArrowRight size={18} /></span>
              <label className="field-block">
                <span className="field-label"><MapPin size={14} /> HEADED TO</span>
                <input value={destination} onChange={(event) => setDestination(event.target.value)} aria-label="Destination" required />
              </label>
            </div>

            <div className="field-grid">
              <label className="field-block">
                <span className="field-label"><CalendarDays size={14} /> ARRIVAL</span>
                <input type="date" name="start_date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label="Arrival date" required />
              </label>
              <label className="field-block">
                <span className="field-label"><CalendarDays size={14} /> DEPARTURE</span>
                <input type="date" name="end_date" value={endDate} onChange={(e) => setEndDate(e.target.value)} aria-label="Departure date" required />
              </label>
              <label className="field-block">
                <span className="field-label"><Users size={14} /> TRAVELERS</span>
                <select name="travelers" defaultValue="2" aria-label="Number of travelers">
                  <option value="1">1 traveler</option>
                  <option value="2">2 travelers</option>
                  <option value="3">3 travelers</option>
                  <option value="4">4 travelers</option>
                  <option value="5">5+ travelers</option>
                </select>
                <ChevronDown className="select-chevron" size={15} />
              </label>
              <label className="field-block">
                <span className="field-label"><Wallet size={14} /> TOTAL BUDGET</span>
                <span className="budget-input"><span>₹</span><input name="budget" type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} min="1" aria-label="Total budget in rupees" required /></span>
              </label>
            </div>

            <div className="preferences-row">
              <fieldset className="interest-fieldset">
                <legend className="field-label">WHAT ARE YOU IN THE MOOD FOR?</legend>
                <div className="interest-list">
                  {interestOptions.map((item) => (
                    <button
                      className={`interest-chip ${interests.includes(item) ? 'selected' : ''}`}
                      key={item}
                      onClick={() => toggleInterest(item)}
                      type="button"
                    >
                      {interests.includes(item) && <Check size={13} />}{item}
                    </button>
                  ))}
                  <button className="add-interest" type="button" aria-label="Add another interest"><Plus size={16} /></button>
                </div>
              </fieldset>
              <div className="select-pair">
                <label className="field-block compact-field">
                  <span className="field-label">TRAVEL STYLE</span>
                  <select name="travel_style" defaultValue="A little of everything" aria-label="Travel style">
                    <option>A little of everything</option><option>Easygoing</option><option>Comfort first</option><option>See it all</option>
                  </select>
                  <ChevronDown className="select-chevron" size={15} />
                </label>
                <label className="field-block compact-field">
                  <span className="field-label">ACTIVITY LEVEL</span>
                  <select name="activity_level" defaultValue="Balanced" aria-label="Activity level">
                    <option>Balanced</option><option>Low-key</option><option>Keep me moving</option>
                  </select>
                  <ChevronDown className="select-chevron" size={15} />
                </label>
                <label className="field-block compact-field">
                  <span className="field-label">FOOD PREFERENCES</span>
                  <select name="food_preferences" defaultValue="Local & vegetarian-friendly" aria-label="Food preferences">
                    <option>Local & vegetarian-friendly</option><option>Anything local</option><option>Vegetarian</option><option>Vegan</option><option>No preference</option>
                  </select>
                  <ChevronDown className="select-chevron" size={15} />
                </label>
              </div>
            </div>

            <div className="request-area">
              <div className="mode-tabs" role="tablist" aria-label="Planning mode">
                <button className={mode === 'text' ? 'mode-tab active' : 'mode-tab'} onClick={() => setMode('text')} type="button" role="tab" aria-selected={mode === 'text'}>Write it</button>
                <button className={mode === 'voice' ? 'mode-tab active' : 'mode-tab'} onClick={() => setMode('voice')} type="button" role="tab" aria-selected={mode === 'voice'}>Say it</button>
              </div>
              {mode === 'text' ? (
                <textarea
                  className="request-input"
                  value={request}
                  onChange={(event) => setRequest(event.target.value)}
                  placeholder="Anything else we should know? Maybe a birthday dinner, rooftop views, or no early starts..."
                  aria-label="Additional trip request"
                  rows="2"
                />
              ) : (
                <div className="voice-prompt">
                  <button className={`mic-button ${voiceStatus === 'recording' ? 'recording' : ''}`} onClick={startVoiceRequest} type="button" aria-label={voiceStatus === 'recording' ? 'Recording request' : 'Start voice request'} aria-pressed={voiceStatus === 'recording'}><Mic size={20} /></button>
                  <div>
                    <strong>{voiceStatus === 'recording' ? 'Listening...' : recognizedRequest || 'Tell us what you have in mind'}</strong>
                    <span>{voiceStatus === 'recording' ? 'Speak naturally; your request will appear here.' : recognizedRequest ? 'Request recognized. Plan when you are ready.' : `Try saying: “Plan a trip to ${activeDest.city} for two people”`}</span>
                  </div>
                </div>
              )}

              <div className="voice-suggestions">
                <span className="voice-suggestion-label">✨ Quick Inspiration Prompts:</span>
                <div className="voice-chips">
                  {VOICE_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      className="voice-chip"
                      type="button"
                      onClick={() => applyVoiceSuggestion(item)}
                    >
                      🎤 {item.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-footer">
              <p><Sparkles size={15} /> PERSONALIZED AROUND YOU</p>
              <button className="plan-button" type="submit" disabled={loading}>{loading ? 'Planning...' : `Plan my trip to ${activeDest.city}`} <ArrowRight size={17} /></button>
            </div>
            {statusMessage && <p className="preview-notice" role="status">{statusMessage}</p>}
            {error && <p className="error-notice" role="alert">{error}</p>}
          </form>
        </section>

        {trip ? (
          <section id="trip-results" className="trip-results">
            <div className="result-heading">
              <div><p className="eyebrow">YOUR ITINERARY IS READY</p><h2>{trip.destination} <span>{trip.duration_days} days</span></h2></div>
              <button className="save-button" onClick={handleSaveTrip} type="button" disabled={saving || trip.is_saved}>{trip.is_saved ? <Check size={15} /> : <Plus size={15} />}{saving ? 'Saving...' : trip.is_saved ? 'Saved' : 'Save trip'}</button>
            </div>
            <p className="trip-summary">{trip.trip_summary}</p>
            <div className="result-meta"><span><MapPin size={14} /> {trip.origin} <ArrowRight size={13} /> {trip.destination}</span><span><CalendarDays size={14} /> {trip.start_date} — {trip.end_date}</span><span><Users size={14} /> {trip.travelers} travelers</span><strong>{money(trip.estimated_total_budget)} <small>estimated total</small></strong></div>

            <div className="budget-breakdown">
              {[
                ['Transportation', trip.transportation_estimate],
                ['Accommodation', trip.accommodation_estimate],
                ['Food', trip.food_estimate],
                ['Activities', trip.activity_estimate],
              ].map(([label, amount]) => <div className="budget-cell" key={label}><span>{label}</span><strong>{money(amount)}</strong></div>)}
            </div>

            <div className="result-actions">
              <button className="listen-button" onClick={handleSpeak} type="button" disabled={speaking}><Headphones size={16} /> {speaking ? 'Preparing audio...' : 'Listen to trip'}</button>
              {audioSource && <audio className="trip-audio" controls src={audioSource}>Audio playback is not supported by this browser.</audio>}
            </div>

            <div className="itinerary-days">
              {trip.day_by_day_itinerary.map((day) => (
                <article className="itinerary-day" key={day.day_number}>
                  <div className="itinerary-day-heading"><div><span className="day-index">DAY {String(day.day_number).padStart(2, '0')}</span><h3>{day.title}</h3><p>{day.date}</p></div><div className="day-cost"><strong>{money(day.estimated_daily_cost)}</strong><span>ESTIMATED DAY COST</span></div></div>
                  <div className="activity-grid">
                    {[
                      ['Morning', day.morning_activities],
                      ['Afternoon', day.afternoon_activities],
                      ['Evening', day.evening_activities],
                    ].map(([period, activities]) => (
                      <div className="activity-period" key={period}><span className="period-label">{period}</span>{activities.map((activity, index) => <div className="activity-item" key={`${activity.title}-${index}`}><strong>{activity.time && <span>{activity.time} · </span>}{activity.title}</strong><p>{activity.description}</p><span className="activity-location"><MapPin size={12} />{activity.location}{activity.estimated_cost > 0 && ` · ${money(activity.estimated_cost)}`}</span></div>)}</div>
                    ))}
                  </div>
                  {day.notes?.length > 0 && <p className="day-notes">{day.notes.join(' · ')}</p>}
                  <button className="regenerate-button" onClick={() => handleRegenerateDay(day.day_number)} type="button" disabled={busyDay === day.day_number}>{busyDay === day.day_number ? 'Refreshing day...' : 'Regenerate day'}</button>
                </article>
              ))}
            </div>

            <div className="recommendation-grid">
              <section className="recommendation-block"><p className="eyebrow">WORTH A STOP</p><h3>Places to visit</h3>{trip.places_and_activities.map((place) => <article className="recommendation-item" key={place.name}><strong>{place.name}</strong><span>{place.type} · {place.best_time_to_visit}</span><p>{place.description}</p></article>)}</section>
              <section className="recommendation-block"><p className="eyebrow">A GOOD TABLE</p><h3>Food recommendations</h3>{trip.recommended_restaurants.map((restaurant) => <article className="recommendation-item" key={restaurant.name}><strong>{restaurant.name}</strong><span>{restaurant.cuisine} · {restaurant.price_range} · {restaurant.address_or_area}</span><p>{restaurant.highlight_dish}. {restaurant.why_recommended}</p></article>)}</section>
            </div>

            <div className="tips-grid"><section><p className="eyebrow">BEFORE YOU GO</p><h3>Travel tips</h3><ul>{trip.travel_tips.map((tip) => <li key={tip}>{tip}</li>)}</ul></section><section><p className="eyebrow">PACK LIGHT, PACK RIGHT</p><h3>Packing suggestions</h3><ul>{trip.packing_suggestions.map((item) => <li key={item}>{item}</li>)}</ul></section></div>

            <form className="modify-form" onSubmit={handleModify}><div><p className="eyebrow">MAKE IT MORE YOU</p><h3>Want to change something?</h3></div><label className="modify-input"><input value={modification} onChange={(event) => setModification(event.target.value)} placeholder="Make Day 2 cheaper, add food experiences..." aria-label="Trip change request" /><button type="submit" disabled={loading || !modification.trim()}><ArrowRight size={17} /></button></label></form>
          </section>
        ) : (
          <section id="sample-trip" className="sample-section">
            <div className="sample-heading">
              <div><p className="eyebrow">A SMALL TASTE OF WHAT'S POSSIBLE</p><h2>{activeSample.sampleTrip.title}</h2></div>
              <span className="sample-label">SAMPLE ITINERARY</span>
            </div>

            <div className="sample-tabs" role="tablist" aria-label="Sample city itineraries">
              {POPULAR_DESTINATIONS.map((d, idx) => (
                <button
                  key={d.id}
                  className={`sample-tab ${sampleCityIndex === idx ? 'active' : ''}`}
                  onClick={() => setSampleCityIndex(idx)}
                  type="button"
                >
                  {d.emoji} {d.city}
                </button>
              ))}
            </div>

            <div className="sample-meta">
              <span><MapPin size={15} /> {activeSample.fullName}</span>
              <span><CalendarDays size={15} /> {activeSample.sampleTrip.days} days</span>
              <span><Users size={15} /> {activeSample.sampleTrip.travelers}</span>
              <strong>{activeSample.sampleTrip.budget} <small>estimated</small></strong>
            </div>

            <div className="day-strip">
              {activeSample.sampleTrip.highlights.map((h, i) => (
                <article className="day-card" key={i}>
                  <span className="day-index">{h.day} <i>{h.date}</i></span>
                  <h3>{h.title}</h3>
                  <p>{h.desc}</p>
                  <span className="day-time">{h.tags}</span>
                </article>
              ))}
            </div>

            <button className="listen-button sample-listen" type="button" disabled>
              <Headphones size={16} /> Listen to a sample <span>Audio is generated for your personalized trip above.</span>
            </button>
          </section>
        )}

        {showSavedTrips && (
          <section id="saved-trips" className="saved-trips">
            <div className="sample-heading">
              <div><p className="eyebrow">YOUR COLLECTION</p><h2>Saved trips</h2></div>
              <span className="sample-label">{savedTrips.length} TRIPS</span>
            </div>
            {savedTrips.length ? (
              <div className="saved-list">
                {savedTrips.map((savedTrip) => (
                  <button
                    className="saved-trip"
                    key={savedTrip.id}
                    onClick={async () => {
                      try {
                        setTrip(await travelApi.getTripById(savedTrip.id))
                        setShowSavedTrips(false)
                      } catch {
                        setError('Could not load that saved trip.')
                      }
                    }}
                    type="button"
                  >
                    <span>
                      <strong>{savedTrip.title}</strong>
                      <small>{savedTrip.start_date} · {savedTrip.duration_days} days · {savedTrip.travelers} travelers</small>
                    </span>
                    <strong>{money(savedTrip.estimated_total_budget, savedTrip.currency)}</strong>
                    <ArrowRight size={16} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="empty-saved">No saved trips yet. Save an itinerary to keep it here.</p>
            )}
          </section>
        )}

        <footer className="page-footer">
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark"><Compass size={17} /></span>
            <span>travel<span className="brand-ai">ai</span></span>
          </a>
          <span>Explore India, Asia, Europe, and beyond.</span>
          <a href="#planner">Back to planning <ArrowRight size={14} /></a>
        </footer>
      </main>
    </div>
  )
}

export default App
