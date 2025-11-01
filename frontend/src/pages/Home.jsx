import { useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import PopularDishes from '../components/PopularDishes'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      <Header />
      <Hero />
      <Categories />
      <PopularDishes />
      <HowItWorks />
      <Footer />
    </div>
  )
}

export default Home

