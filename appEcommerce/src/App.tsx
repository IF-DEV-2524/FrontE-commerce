import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Componente que será carregado imediatamente (não lazy)
import Header from './Components/Header.tsx';
import './App.css';

// 1. Definição Lazy dos Componentes
const Bag = lazy(() => import('./Pages/Bag.tsx'));
const Payment = lazy(() => import('./Pages/Payment.tsx'));
const Confirmation = lazy(() => import('./Pages/Confirmation.tsx'));

function App() {
  return (
    // Removido o Fragmento <> ... </> desnecessário
    
    <BrowserRouter>
      {/* O Header fica fora do Routes para ser visível em todas as rotas */}
      <Header />
      
      <Suspense fallback={
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Carregando Página...</h1>
          <p>Aguarde um momento.</p>
        </div>
      }>
        <Routes>
          {/* ROTAS CORRIGIDAS: Rotas de Nível Superior (Páginas independentes) */}
          
          {/* Rota da Sacola (Home) */}
          <Route path="/" element={<Bag />} /> 
          
          {/* Rota do Pagamento (Ajustei o path para um nome simples) */}
          <Route path="/payment" element={<Payment />} />
          
          {/* Rota de Confirmação (Ajustei o path para um nome simples) */}
          <Route path="/confirmation" element={<Confirmation />} />

          {/* Rota de fallback para 404 */}
          <Route path="*" element={<h1>Página Não Encontrada</h1>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    // Fim da aplicação
  );
}

export default App;