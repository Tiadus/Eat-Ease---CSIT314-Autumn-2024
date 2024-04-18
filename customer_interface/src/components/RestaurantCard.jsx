import React from 'react'
import image from '../assets/Images/guzman.png'
import { FaArrowCircleRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({name, code, rating, restaurantCode, location}) => {
    const navigate = useNavigate(); 
    const handleOnClick = () => {
        // console.log('handleOnClick')
        navigate(`/menu?name=${name}`)
    }
    return (
        <div onClick={handleOnClick} className='grid grid-cols-5  items-center bg-gray-300 rounded-lg'>
            <img className='w-[150px] h-[150px] col-start-1 col-span-1' src={image} alt="" />
            <div className='col-start-2 col-span-2 '>
                <p className='text-2xl font-semibold '>{name}</p>
                <p >MExian dish pow pow!!!!!.</p>
                <p>Location: {location}</p>
                <p>Restaurant Code {restaurantCode}</p>
                <p >Rating {rating}</p>
                <FaArrowCircleRight className='text-eatEase h-5 w-5 ' />
            </div>
        </div>)
}

export default RestaurantCard