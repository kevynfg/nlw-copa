interface HomeProps {
  count: number;
}

export default function Home(props: HomeProps) {
  return (
    <h1>Hello, {props.count}</h1>
  )
}

export const getServerSideProps = async () => {
  const response = (await (await fetch('http://localhost:3333/pools/count')).json());

  console.log(response)

  return {
    props: {
      count: response.count
    }
  }
}
