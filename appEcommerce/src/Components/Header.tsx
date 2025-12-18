import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Header.css';
import api from '../Services/Api'


// 1. Tipagem (TSX): Define os IDs válidos para o estado,
type NavLinkID = 'bag' | 'payment' | 'confirmation' | '';

function Header(){
const [products, setProducts] = useState([])

async function getProducts() {
  const response = await api.get('/products');
  setProducts(response.data); // <-- aqui está o dado de verdade
  console.log(products)
}

useEffect(() => {
  getProducts();
}, []);

useEffect(() => {
  // Função que escuta o evento disparado pelo outro componente
  const handleUpdate = (event: any) => {
    if (event.detail) {
      setActiveLink(event.detail as NavLinkID);
    }
  };

  // Adiciona o listener quando o componente monta
  window.addEventListener('updateHeader', handleUpdate);

  // Remove o listener quando o componente desmonta (limpeza)
  return () => {
    window.removeEventListener('updateHeader', handleUpdate);
  };
}, []);

// 2. MUDANÇA NO ESTADO: O estado agora armazena uma string que é o ID do link ativo.
const [activeLink, setActiveLink] = useState<NavLinkID>('');

// 3. HANDLER ATUALIZADO: A função recebe o ID (string) do link clicado
function handleLinkClick(linkId: NavLinkID) {
  // Define o estado para o ID recebido.
  setActiveLink(linkId);
}

return (
  <>
    <header className='containerHeader'>
      <nav className='navigation'>
        <ul className='containerNavigate'>
          {/* ITEM: SACOLA */}
          <li className='listNavigation'>
            <Link to={"/"} // Path: Corresponde ao path="/" no App.tsx
              className={`btnBag ${activeLink === 'bag' ? 'active' : ''}`}
              onClick={() => handleLinkClick('bag')}
            >
              Sacola
            </Link>
            <hr className={`lineBag ${activeLink === 'bag' ? 'active' : ''}`} />
          </li>

          {/* ITEM: PAGAMENTO */}
          <li className='listNavigation'>
            <Link to={"/payment"} // CORRIGIDO: Usando Link e path="/payment"
              className={`btnPayment ${activeLink === 'payment' ? 'active' : ''}`}
              onClick={() => handleLinkClick('payment')}
            >
              Pagamento
            </Link>
            <hr className={`linePayment ${activeLink === 'payment' ? 'active' : ''}`} />
          </li>

          {/* ITEM: CONFIRMAÇÃO */}
          <li className='listNavigation'>
            <Link to={"/confirmation"} // CORRIGIDO: Usando Link e path="/confirmation"
              className={`btnConfirmation ${activeLink === 'confirmation' ? 'active' : ''}`}
              onClick={() => handleLinkClick('confirmation')}
            >
              Confirmação
            </Link>
            <hr className={`lineConfirmation ${activeLink === 'confirmation' ? 'active' : ''}`} />
          </li>
        </ul>
      </nav>
    </header>
  </>
);
}

export default Header;