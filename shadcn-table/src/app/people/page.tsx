import React from 'react'
import PeopleDataTable from './data-table'
import { columns } from './columns'
import { people } from '@/people'

type Props = {}

const People = (props: Props) => {
  return (
    <PeopleDataTable columns={columns} data={people} />
  )
}

export default People