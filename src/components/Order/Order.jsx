import React from 'react'
import { useGetAllOrdersQuery } from '../../redux/OrdersApi'

const Orders = () => {

    const {data:getAllOrders, isLoading, isError} = useGetAllOrdersQuery()

    console.log("ORDERS_DATA:", getAllOrders)

  return (
    <section>Order</section>
  )
}

export default Orders