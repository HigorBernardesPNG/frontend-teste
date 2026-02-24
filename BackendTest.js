function validaPedido(pedido){
  
  if(array.isArray(pedido)) return {ok:false, error:"INVALID_INPUT"};
  if(pedido.length === 0) return {ok:false, error:"EMPTY_LIST"};
  if(typeof pedido.valor != "number" && typeof pedido.pago != "boolean") return {ok:false, error:"INVALID_ORDER"};
  return {ok:true, value:pedido.pago}
  
}

console.log(validaPedido({valor:32,pago:true}));
