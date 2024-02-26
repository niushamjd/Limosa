import React from 'react'
import ServiceCard from './ServiceCard'
import {Col} from 'reactstrap'

import transferImg from '../assets/images/transfer.png'
import toursImg from '../assets/images/tours.png'
import customizationImg from '../assets/images/customization.png'

const servicesData = [
  {
    imgUrl: transferImg,
    title: 'Transfer',
    desc: 'Find a transfer for your trip'
  },
  {
    imgUrl: toursImg,
    title: 'Tours',
    desc: 'Find a tour for your trip'
  },
  {
    imgUrl: customizationImg,
    title: 'Customization',
    desc: 'Customize your trip'
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