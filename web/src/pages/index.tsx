import { api } from "../lib/axios";
import Image from "next/image";
import appPreviewImage from '../assets/aplicacao-trilha-ignite.png'
import logoImg from '../assets/logo.svg'
import iconCheck from '../assets/icon-check.svg'
import usersAvatarExample from '../assets/avatares.png'
import { FormEvent, useState } from "react";


interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}


export default function Home(props: HomeProps) {

  const [poolTitle, setPoolTitle] = useState("");
  console.log(poolTitle)
  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const poolCreatedResponse = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = poolCreatedResponse.data;
      await navigator.clipboard.writeText(code);
      alert('Bolão criado com sucesso, o código foi copiado para área de transferência');
      setPoolTitle("");
    } catch (error) {
      alert('Falha ao criar bolão!')
      console.log(error)
      setPoolTitle("");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="Nlw Copa" />
        
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        
        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExample} alt=""/>
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>
        
        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input 
            type="text" 
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            required 
            placeholder="Qual nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
            />
          <button 
            type="submit" 
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700">
              Criar meu bolão
          </button>
        </form>
        
        <p className="text-gray-300 mt-4 text-sm leading-relaxed">Após criar seu bolão, você receberá um código único que poderá usar para convidar pessoas</p>
        
        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"></div>
          
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image 
          src={appPreviewImage} 
          alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
          quality={70}
        />
    </div>
  )
}

export const getStaticProps = async () => {
  const [poolCountResponse, guessesCountResponse, userCountResponse] = await Promise.all(
    [
      api.get('pools/count'),
      api.get('guesses/count'),
      api.get('users/count')
    ]
  )

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessesCountResponse.data.count,
      userCount: userCountResponse.data.count
    },
    revalidate: 60 * 10
  }
}
