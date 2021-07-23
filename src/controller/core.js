export class Data {
    static isNewApp = false;
    static isOpenApp = false;
    static content = [];
    static history = [];
    static mode = 0; //0=prod 1=debug
    static currentApp = undefined;
    static apps = [
        {
            name: 'Carteira Virtual',
            category: 'Finaceiro',
            created: "18-07-2021",
            color: '#0095ff',
            data: [
                { command: 'Saldo', desc: 'Verifica seu saldo atual', response: 'Seu saldo é R$10,30', api: 'http://api.com/cartao/saldo/12345678911', type: 'texto' },
                { command: 'Gerar cartão', desc: 'Gera um qrcode do cartão.', response: 'Novo cartão gerado. Utilize o QRCode para autorizar a compra.', api: 'https://miro.medium.com/max/1280/0*zPG9dqz508rmRR70.', type: 'imagem' },
            ]
        }
    ];
}

export function process(msg) {
    Data.content = []
    console.log(msg)
    if (parse(msg) === parse('ajuda') && Data.currentApp === undefined) {
        speak('Opções disponíveis:');
        speak('- Criar novo Aplicativo');
        speak('- Abrir aplicativo');
        speak('- Fechar aplicativo');
    } else if (parse(msg) === parse('ajuda')) {
        speak(Data.currentApp.name + ' possui as seguintes opções.')
        Data.currentApp.data.map((el) => speak('- ' + el.command + ' - ' + el.desc))
    } else {
        Data.history.push(<span className="me" key={Data.history.length}>{msg}<br></br></span>);
        Data.content.push(<span className="me" key={Data.history.length}>{msg}<br></br></span>);
        if (parse(msg) === parse('criar novo aplicativo') || Data.isNewApp) {
            newApp(msg);
            return
        }
        if (parse(msg) === parse('abrir aplicativo')) {
            Data.isOpenApp = false;
            Data.currentApp = undefined
            openApp(msg);
            return
        }
        if (parse(msg) === parse('fechar aplicativo')) {
            Data.isOpenApp = false;
            Data.currentApp = undefined
            speak('Aplicativo fechado.')
            return
        }
        if (Data.isOpenApp) {
            openApp(msg);
            return
        }
        
    }
}

function newApp(msg) {
    if (!Data.isNewApp) {
        Data.isNewApp = true;
        speak('Vamos criar um novo aplicativo')
        speak('Qual o nome do aplicativo')
        return
    }
    if (Data.currentApp.name === undefined) {
        Data.currentApp.name = msg;
        speak('Qual a categoria do aplicativo.')
        return
    }
    if (Data.currentApp.category === undefined) {
        Data.currentApp.category = msg;
        Data.currentApp.created = new Date();
        speak('Aplicativo ' + Data.currentApp.name + ' criado.')
        speak('Agora você precisa informar os dados de ' + Data.currentApp.name);
        return
    }
    if (Data.currentApp.data === undefined) {

        return
    }
}

function openApp(msg) {
    Data.isNewApp = false;
    if (!Data.isOpenApp) {
        Data.isOpenApp = true;
        speak('Qual o nome do aplicativo?');
        return
    }
    if (Data.currentApp === undefined) {
        const app = Data.apps.filter((el) => parse(el.name) === parse(msg));
        if (app.length > 0) {
            Data.currentApp = app[0];
            speak(Data.currentApp.name + ' possui as seguintes opções.')
            Data.currentApp.data.map((el) => speak('- ' + el.command + ' - ' + el.desc))
        } else {
            speak('Aplicativo não encontrado.')
        }
        return
    }
    const commands = Data.currentApp.data.filter((el) => parse(el.command) === parse(msg))
    if (commands.length > 0) {
        speak(commands[0].response)
        if (commands[0].type === 'imagem') {
            Data.history.push(<img key={Data.history.length} src={commands[0].api} className="image" alt={commands[0].command} />);
            Data.history.push(<span></span>)
            Data.content.push(<img key={Data.history.length} src={commands[0].api} className="image" alt={commands[0].command} />);
            Data.content.push(<span>===</span>)
        }
    } else {
        speak("Comando não encontrado.");
    }

}

function parse(str) {
    return str.replaceAll(' ', '').toLowerCase();
}

export function speak(msg) {
    Data.history.push(<span key={Data.history.length}>{msg}<br></br></span>);
    Data.content.push(<span key={Data.history.length}>{msg}<br></br></span>);
    speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
}