const Koa = require('koa');
const bodyparser = require('koa-bodyparser');


const server = new Koa();


server.use(bodyparser());

const produto = {
    id: 1,
    nome: 'nome do produto',
    quantidade: 10,
    valor: 1000,
    deletado: false    
}
const pedido = {
    id: 7,
    produtos: [produto],
    estado: "incompleto",
    idCliente: 5590,
    deletado: false,
    valorTotal: 10000

}
const listaPedidos = [pedido];
const listaProdutos = [produto];

const addNovoProduto = (produto) => {
    const novoProduto = {
        id: listaProdutos.length+1,
        nome: produto.nome ? produto.nome : 'Sem nome de produto',
        quantidade: produto.quantidade ? produto.quantidade: 0,
        valor: produto.valor ? produto.valor : 0000,
        deletado: false
    };
    listaProdutos.push(novoProduto);
    return novoProduto;
}
const addNovoPedido = (pedido) => {
    const novoPedido = {
        id:  listaPedidos.length+1,
        estado: 'incompleto',
        produtos: pedido.produtos ? pedido.produtos: [],
        idCliente: pedido.idCliente? pedido.idCliente: 0,
        deletado: false,
        valorTotal: pedido.valorTotal ? pedido.valorTotal : 0000,
        
    };   

    listaPedidos.push(novoPedido);
    return novoPedido;
}
const obtendoListaDeProdutos = () => {
    const listaSemDeletados = [];
    listaProdutos.forEach(elemento =>{
        if(elemento.deletado=== false){
            listaSemDeletados.push(elemento);
        }
    })
    return listaSemDeletados;
} 
const obtendoListaDePedidos = () => {
    const pedidosSemDeletados = [];
    listaPedidos.forEach(elemento =>{
        if(elemento.deletado=== false){
            pedidosSemDeletados.push(elemento);
        }
    })
    return pedidosSemDeletados;
} 
const listarUmproduto = (index) => {
    const produto = listaProdutos[index];
    if(produto){
        return produto;
    }
    else{
        return null;
    }
}
const listarUmPedido = (index) => {
    const pedido = listaPedidos[index];
    if(pedido){
        return pedido;
    }
    else{
        return null;
    }
}
const deletarUmProduto = (index) => {
    const produto= listarUmproduto(index);

    if(produto){
        listaProdutos.splice(index, 1);
        return true;
    }
    else{
        return false;
    }
}
const deletarUmPedido = (index) => {
    const pedido = listarUmPedido(index);

    if(pedido){
        listaPedidos.splice(index, 1);
        return true;
    }
    else{
        return false;
    }
}
const atualizarQuantidade = (index, quantidade) => {
    const produto = listarUmproduto (index);  
    if (produto) {
        const produtoAtualizadoQuantidade = {
            id: produto.id,
            nome: produto.nome,
            quantidade: quantidade,
            valor: produto.valor,
            deletado: produto.deletado,
        };
        listaProdutos.splice(index, 1, produtoAtualizadoQuantidade);
        return produtoAtualizadoQuantidade;
    } else {
      return false;
    }
}


addProdutoAoPedido(7,{
    id: 1,
    nome: 'nome do produto',
    quantidade: 10,
    valor: 1000,
    deletado: false    
})


server.use((ctx)=>{
    const path = ctx.url;
    const method = ctx.method;
    if(path === '/products'){
        if (method ==='GET'){
            ctx.body = obtendoListaDeProdutos();
        }
        else if(method ==='POST'){
            const produto = addNovoProduto(ctx.request.body);
            ctx.body = produto;
        }
        else if(method === "PUT"){
            
            const index = ctx.request.body.index;
            
            const quantidade = ctx.request.body.quantidade;
            const nome = ctx.request.body.nome;
            
            if(index  && typeof quantidade === 'number'){
                const produto = atualizarQuantidade(index, quantidade);

                produto ? ctx.body = produto : ctx.body = "Não foi possível atualizar esse produto!";        
            }
            else{
                ctx.status = 404;
                ctx.body = 'Não encontrado!';
            }                     
           
        }      
            
    }
    
    else if (path.includes("/products/")){
        const pathQuebrado = path.split('/');
        if(pathQuebrado[1]==="products"){
            const index = pathQuebrado[2];
            if(index){
                if(method === 'GET'){
                    ctx.body = listarUmproduto(index);
                }
                else if(method=== 'DELETE'){
                    const retorno = deletarUmProduto(index);
                    (retorno ===true) ? ctx.body =  "Produto deletado com sucesso!": ctx.body = "Não foi possível deletar esse produto" ;
                }
                else{
                    ctx.status = 404;
                    ctx.body = 'Não encontrado!';
                }
                
                
            }
            else{
                ctx.status = 404;
                ctx.body = 'Conteúdo não encontrado';
            }
        }
        
    }
    else if(path ==='/orders'){
        if(method === 'GET'){
            ctx.body = obtendoListaDePedidos ();
        }
        else if(method ==='POST'){
            const pedido = addNovoPedido(ctx.request.body);
            ctx.body = pedido;
        }
        else if(method === "PUT"){
            
            const index = ctx.request.body.index;            
            const quantidade = ctx.request.body.quantidade;
            const id = ctx.request.body.id;
            
            if(index && id && typeof quantidade === 'number'){
                const pedido = atualizarQuantidade(index, quantidade);

                produto ? ctx.body = produto : ctx.body = "Não foi possível atualizar esse produto!";        
            }
            else{
                ctx.status = 404;
                ctx.body = 'Não encontrado!';
            }     
        }
        else{
            ctx.status = 404;
            ctx.body = 'Não encontrado!';
        }

    }
    else if (path.includes("/orders/")){
        const pathQuebrado = path.split('/');
        if(pathQuebrado[1]==="orders"){
            const index = pathQuebrado[2];
            if(index){
                if(method === 'GET'){
                    ctx.body = listarUmPedido(index);
                }
                else if(method=== 'DELETE'){
                    const retorno = deletarUmPedido(index);
                    (retorno ===true) ? ctx.body =  "Pedido deletado com sucesso!": ctx.body = "Não foi possível deletar esse pedido" ;
                }
                
                else{
                    ctx.status = 404;
                    ctx.body = 'Não encontrado!';
                }
                
                
            }
            else{
                ctx.status = 404;
                ctx.body = 'Não encontrado!';
            }
     
        }
    }
    else{
        ctx.status = 404;
        ctx.body = 'Não encontrado!';
    }

})



server.listen(8081, ()=>   console.log('O servidor está rodando'))