import React from 'react'
import ServiceCard from './ServiceCard'
import {Col} from 'reactstrap'

import transferImg from '../assets/images/transfer.png'
import toursImg from '../assets/images/tours.png'
import customizationImg from '../assets/images/customization.png'

const servicesData = [
  {
    imgUrl: transferImg,
    title: 'Tailored Travel Itineraries',
    desc: "Experience journeys crafted to your preferences with Limosa's AI-driven planning"
  },
  {
    imgUrl: toursImg,
    title: 'Group Travel Harmony',
    desc: 'Connect and sync travel plans with friends and family for a unified adventure'
  },
  {
    imgUrl: customizationImg,
    title: 'Business Visibility Boost',
    desc: 'Enhance your reach and ratings by engaging more relevant customers through Limosa'
  }
]

const ServiceList = () => {
  return <>
    {servicesData.map((item, index) => (
      <Col lg="3" md='6' sm='12' className='mb-4' key={index}>
        <ServiceCard item={item} />
      </Col>
    ) )}
  </>
}

export default ServiceList