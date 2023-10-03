import React from 'react'
import { useTranslation } from 'react-i18next'
const Home = () => {
  const {t} = useTranslation(["home"])
  return (
    <div>
      {t("home")}
    </div>
  )
}

export default Home
