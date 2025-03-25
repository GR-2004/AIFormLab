import React from 'react';
import CreateForm from './_components/CreateForm';
import FormList from './_components/FormList';


export default function DashboardPage() {
  return (
    <div className='p-6'>
      <h2 className='flex items-center justify-between font-bold text-3xl'>
        Dashboard
        <CreateForm/>
      </h2>
      <FormList/>
    </div>
  );
}