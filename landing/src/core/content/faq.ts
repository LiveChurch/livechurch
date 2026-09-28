export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "É grátis mesmo?",
    answer: "Sim. O LiveChurch é totalmente gratuito e todos os recursos vêm no mesmo download.",
  },
  {
    question: "Preciso de internet durante o culto?",
    answer:
      "A Bíblia (ACF, Almeida Revisada e NVI), a Harpa Cristã, os slides livres e a agenda funcionam offline. A internet é usada para buscar letras de outras músicas e para as imagens de fundo dos temas.",
  },
  {
    question: "Posso projetar a letra de qualquer música?",
    answer:
      "Sim. Busque pelo título e o programa traz a letra da internet e a divide em slides, que você ainda pode editar. Isso depende do serviço de letras estar disponível.",
  },
  {
    question: "Funciona em quais computadores?",
    answer: "Windows e Linux.",
  },
  {
    question: "Consigo projetar em TV ou projetor?",
    answer:
      "Sim. Conecte o telão, escolha o monitor no rodapé do programa e a projeção abre em tela cheia nele, enquanto você controla tudo na tela principal.",
  },
  {
    question: "Um voluntário sem experiência consegue operar?",
    answer:
      "Tudo começa na barra de busca: você digita, escolhe o resultado e confere a prévia do slide antes de mandar para o telão.",
  },
  {
    question: "O programa ainda está em beta?",
    answer: "Sim, e pode apresentar instabilidades. Recomendamos testar antes do culto.",
  },
];
