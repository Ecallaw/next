
"use client";
import { useEffect, useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { User } from "@prisma/client";
import { getUsers } from "@/models/user";
import { HiUser } from "react-icons/hi/";
import { MdOutlineDone, MdGroupRemove } from "react-icons/md/";
import { BiCheckShield, BiShieldX } from "react-icons/bi/";
import UserForm from "@/components/UserForm";
import AdminPanel from "@/components/AdminPanel";



const deleteUser = async (id: number) => {
  const data = await fetch("/api/user/" + id, {
    method: "DELETE",
  });
  const res = await data.json();
  if (!res.ok) {
    notifications.show({
      title: "Impossible de supprimer le joueur",
      message: res.error,
      color: "red",
      icon: <IconX />,
    });
  } else {
    notifications.show({
      title: "Suppression réussite !",
      message: res.name + " a été supprimer",
      color: "green",
      icon: <IconCheck />,
    });
  }
  return res;
};

export default function Configuration() {

  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [disabledRemove, setDisabledRemove] = useState(true);
  const [isRed, setIsRed] = useState(false);


  useEffect(() => {
    getUsers().then((res: any) => {
      if (!res.error) {
        setUsers(res);
      }
    });
  }, []);

  const onComplete = () => {
    getUsers().then((res: any) => {
      if (!res.error) {
        setUsers(res);
      }
    });
  };


  return (
    <main className="bg-black flex max-h-[calc(100vh)] min-h-[calc(100vh)] flex-col justify-between">
      <div className="flex flex-col overflow-auto z-10" >
        <div className='flex bg-gray-500 p-6 fixed top-0 left-0 w-full'>
          <div className='flex-1  text-2xl'>Configuration</div>
          <Button leftIcon={<BiCheckShield size="1rem" />} color="gray" className='bg-gray-700 m-0 h-8 mr-4' onClick={() => { setOpenAdmin(true); }}>admin</Button>
          <Button leftIcon={<HiUser />} color="gray" className='bg-gray-700 m-0 h-8' onClick={() => { setOpen(true); setIsRed(false); }}>Ajouter</Button>
        </div>
        <div className='min-h-max	 mt-20 mb-20' >
          <div className='flex flex-row items-center mb-4 border-gray-100 border-b-2 m-4 pb-2'>
            <h2 className='flex-1 text-xl '>Team <span className='text-blue-600 font-medium'>Blue</span></h2>
            <span className='mr-2'>( {users.filter((user: User) => !user.isRed).length} )</span>
          </div>
          {users.filter((user: any) => !user.isRed).map((user: User) => {
            return (
              <div className='flex mr-6' key={user.id}>
                <div className='flex-grow ml-6 mb-6'>{user.name}</div>
                {disabledRemove ? <MdOutlineDone size='1.5rem' /> : <IconX onClick={() => deleteUser(user.id).then(res => {
                  if (res.ok) {
                    onComplete();
                  }
                })
                } />}
              </div>
            );
          })}
          <div className='flex flex-row m-4 pb-2 items-center mb-4 border-gray-100 border-b-2 mt-4'>
            <h2 className='flex-1 text-xl '>Team <span className='text-red-600 font-medium'>Red</span></h2>
            <span className="mr-2" >( {users.filter((user: User) => user.isRed).length} )</span>
          </div>
          <div className="flex flex-col justify-start">
            {users.filter((user: User) => user.isRed).map((user: User) => {
              return (
                <div className='flex mr-6' key={user.id}>
                  <div className='flex-grow ml-6 mb-6'>{user.name}</div>
                  {disabledRemove ? <MdOutlineDone size='1.5rem' /> : <IconX onClick={() => deleteUser(user.id).then(res => {
                    if (res.ok) {
                      onComplete();
                    }
                  })} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* <div>{getScores()}</div> */}
      <AdminPanel open={openAdmin} onClose={() => setOpenAdmin(false)} disabledRemove={disabledRemove}  onRemove={()=> setDisabledRemove(!disabledRemove)}/> 
      <UserForm open={open} onClose={() => setOpen(false)} isRed={isRed} onComplete={() => onComplete()} />
    </main >
  );
}
