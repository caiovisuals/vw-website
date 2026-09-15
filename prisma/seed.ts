import { PrismaClient, type Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const SALT_ROUNDS = 12

type CarSeed = Prisma.CarCreateInput & {
    colors: { create: Prisma.CarColorCreateWithoutCarInput[] }
    wheels: { create: Prisma.CarWheelCreateWithoutCarInput[] }
    seats: { create: Prisma.CarSeatCreateWithoutCarInput[] }
    technologies: { create: Prisma.CarTechnologyCreateWithoutCarInput[] }
    technicalData: { create: Prisma.TechnicalDataCreateWithoutCarInput }
}

const users = [
    {
        name: "Caio Oliveira",
        email: "admin@vwwebsite.dev",
        password: "Admin1234",
        role: "ADMIN" as const,
        phone: "+55 11 99999-0001",
    },
    {
        name: "Equipe Volkswagen",
        email: "staff@vwwebsite.dev",
        password: "Staff1234",
        role: "STAFF" as const,
        phone: "+55 11 99999-0002",
    },
    {
        name: "Cliente Demonstração",
        email: "cliente@vwwebsite.dev",
        password: "Cliente1234",
        role: "USER" as const,
        phone: "+55 11 99999-0003",
    },
]

const PAINT_METALLIC = 2_490
const PAINT_PREMIUM = 3_290

function colors(base: string) {
    return {
        create: [
            { name: "Branco Cristal", hexCode: "#F2F2F2", price: 0, isDefault: true, imageUrl: base },
            { name: "Prata Sirius", hexCode: "#B4B7BA", price: PAINT_METALLIC, isDefault: false, imageUrl: base },
            { name: "Cinza Platinum", hexCode: "#5C6063", price: PAINT_METALLIC, isDefault: false, imageUrl: base },
            { name: "Preto Ninja", hexCode: "#111213", price: PAINT_METALLIC, isDefault: false, imageUrl: base },
            { name: "Azul Biscay", hexCode: "#1B3A6B", price: PAINT_PREMIUM, isDefault: false, imageUrl: base },
        ],
    }
}

function seats(premiumPrice: number) {
    return {
        create: [
            { name: "Tecido Titanium Black", material: "Tecido", price: 0, isDefault: true },
            { name: "Couro ecológico Black", material: "Couro ecológico", price: premiumPrice, isDefault: false },
            { name: "Couro ecológico Bicolor", material: "Couro ecológico", price: premiumPrice + 1_200, isDefault: false },
        ],
    }
}

const cars: CarSeed[] = [
    {
        slug: "polo",
        name: "Polo",
        tagline: "O hatch que virou referência.",
        description: "Compacto, conectado e com motorização TSI. O Polo reúne desempenho e eficiência com o pacote de segurança que tornou o modelo um dos preferidos do brasileiro.",
        basePrice: 96_990,
        fuel: "FLEX",
        transmission: "AUTOMATIC",
        isElectric: false,
        isFeatured: true,
        year: 2026,
        imageUrl: "/assets/cars/polo/polo.webp",
        colors: colors("/assets/cars/polo/polo.webp"),
        wheels: {
            create: [
                { name: "Roda Aro 15 Sirius", sizeInch: 15, price: 0, isDefault: true },
                { name: "Roda Aro 16 Mirabeau", sizeInch: 16, price: 2_100, isDefault: false },
                { name: "Roda Aro 17 Bangalore", sizeInch: 17, price: 3_800, isDefault: false },
            ],
        },
        seats: seats(4_200),
        technologies: {
            create: [
                { name: "VW Play com Wireless", description: "Central multimídia de 10,1\" com espelhamento sem fio.", price: 2_500 },
                { name: "Digital Cockpit", description: "Painel de instrumentos 100% digital de 10,25\".", price: 2_900 },
                { name: "Park Assist", description: "Estacionamento autônomo em vagas paralelas e perpendiculares.", price: 3_400 },
                { name: "Pacote IQ.Drive", description: "Piloto automático adaptativo e frenagem autônoma de emergência.", price: 5_600 },
            ],
        },
        technicalData: {
            create: {
                engineDisplacement: "1.0 TSI 12v",
                enginePower: "128 cv (etanol)",
                engineTorque: "20,4 kgfm",
                acceleration0to100: "9,4 s",
                topSpeed: "196 km/h",
                fuelConsumptionCity: "9,8 km/l (etanol)",
                fuelConsumptionHwy: "11,4 km/l (etanol)",
                tankCapacity: "52 L",
                wheelbase: "2.566 mm",
                length: "4.079 mm",
                width: "1.751 mm",
                height: "1.468 mm",
                curbWeight: "1.158 kg",
                cargoVolume: "300 L",
                frontSuspension: "Independente McPherson",
                rearSuspension: "Eixo de torção",
                brakes: "Discos ventilados (diant.) e tambor (tras.)",
            },
        },
    },
    {
        slug: "nivus",
        name: "Nivus",
        tagline: "O SUV coupé que nasceu no Brasil.",
        description: "Desenho coupé, porta-malas de 415 litros e o VW Play de série. O Nivus é o SUV urbano para quem não abre mão de estilo e tecnologia.",
        basePrice: 134_890,
        fuel: "FLEX",
        transmission: "AUTOMATIC",
        isElectric: false,
        isFeatured: true,
        year: 2026,
        imageUrl: "/assets/cars/nivus/nivus.webp",
        colors: colors("/assets/cars/nivus/nivus.webp"),
        wheels: {
            create: [
                { name: "Roda Aro 16 Sepang", sizeInch: 16, price: 0, isDefault: true },
                { name: "Roda Aro 17 Tucson", sizeInch: 17, price: 2_600, isDefault: false },
                { name: "Roda Aro 17 Diamantada", sizeInch: 17, price: 4_100, isDefault: false },
            ],
        },
        seats: seats(4_800),
        technologies: {
            create: [
                { name: "VW Play com Wireless", description: "Central multimídia de 10,1\" com espelhamento sem fio.", price: 0 },
                { name: "Teto solar panorâmico", description: "Teto solar elétrico com cortina elétrica.", price: 6_900 },
                { name: "Digital Cockpit Pro", description: "Painel digital de 10,25\" com layouts configuráveis.", price: 3_100 },
                { name: "Pacote IQ.Drive", description: "Piloto automático adaptativo e frenagem autônoma de emergência.", price: 5_600 },
                { name: "Beats Audio", description: "Sistema de som Beats com 6 alto-falantes e subwoofer.", price: 3_900 },
            ],
        },
        technicalData: {
            create: {
                engineDisplacement: "1.0 TSI 12v",
                enginePower: "128 cv (etanol)",
                engineTorque: "20,4 kgfm",
                acceleration0to100: "10,0 s",
                topSpeed: "191 km/h",
                fuelConsumptionCity: "9,3 km/l (etanol)",
                fuelConsumptionHwy: "10,9 km/l (etanol)",
                tankCapacity: "52 L",
                wheelbase: "2.566 mm",
                length: "4.266 mm",
                width: "1.757 mm",
                height: "1.493 mm",
                curbWeight: "1.226 kg",
                cargoVolume: "415 L",
                frontSuspension: "Independente McPherson",
                rearSuspension: "Eixo de torção",
                brakes: "Discos ventilados (diant.) e tambor (tras.)",
            },
        },
    },
    {
        slug: "t-cross",
        name: "T-Cross",
        tagline: "Espaço de SUV, tamanho de cidade.",
        description: "O SUV mais versátil da linha: banco traseiro corrediço, porta-malas de até 420 litros e a suíte completa de assistentes de condução.",
        basePrice: 144_390,
        fuel: "FLEX",
        transmission: "AUTOMATIC",
        isElectric: false,
        isFeatured: true,
        year: 2026,
        imageUrl: "/assets/cars/t-cross/t-cross.webp",
        interiorImageUrl: "/assets/consortium/t-cross-photo.webp",
        colors: colors("/assets/cars/t-cross/t-cross.webp"),
        wheels: {
            create: [
                { name: "Roda Aro 16 Manila", sizeInch: 16, price: 0, isDefault: true },
                { name: "Roda Aro 17 Sebring", sizeInch: 17, price: 2_800, isDefault: false },
                { name: "Roda Aro 18 Belmont", sizeInch: 18, price: 4_900, isDefault: false },
            ],
        },
        seats: seats(5_200),
        technologies: {
            create: [
                { name: "VW Play com Wireless", description: "Central multimídia de 10,1\" com espelhamento sem fio.", price: 0 },
                { name: "Teto solar panorâmico", description: "Teto solar elétrico com cortina elétrica.", price: 7_400 },
                { name: "Digital Cockpit Pro", description: "Painel digital de 10,25\" com layouts configuráveis.", price: 3_100 },
                { name: "Pacote IQ.Drive", description: "Piloto automático adaptativo e frenagem autônoma de emergência.", price: 5_600 },
                { name: "Câmera 360º", description: "Visão periférica com quatro câmeras e linhas dinâmicas.", price: 4_300 },
            ],
        },
        technicalData: {
            create: {
                engineDisplacement: "1.4 TSI 16v",
                enginePower: "150 cv (etanol)",
                engineTorque: "25,5 kgfm",
                acceleration0to100: "8,7 s",
                topSpeed: "199 km/h",
                fuelConsumptionCity: "8,6 km/l (etanol)",
                fuelConsumptionHwy: "10,2 km/l (etanol)",
                tankCapacity: "52 L",
                wheelbase: "2.651 mm",
                length: "4.199 mm",
                width: "1.760 mm",
                height: "1.582 mm",
                curbWeight: "1.309 kg",
                cargoVolume: "420 L",
                frontSuspension: "Independente McPherson",
                rearSuspension: "Eixo de torção",
                brakes: "Discos ventilados (diant.) e sólidos (tras.)",
            },
        },
    },
    {
        slug: "taos",
        name: "Taos",
        tagline: "O SUV médio com alma de viajante.",
        description: "Motor 250 TSI, transmissão automática de 6 marchas e um porta-malas de 498 litros. O Taos é feito para estrada, com conforto de classe superior.",
        basePrice: 199_990,
        fuel: "GASOLINE",
        transmission: "AUTOMATIC",
        isElectric: false,
        isFeatured: false,
        year: 2026,
        imageUrl: "/assets/cars/taos/taos.webp",
        colors: colors("/assets/cars/taos/taos.webp"),
        wheels: {
            create: [
                { name: "Roda Aro 17 Montana", sizeInch: 17, price: 0, isDefault: true },
                { name: "Roda Aro 18 Sebring", sizeInch: 18, price: 3_600, isDefault: false },
                { name: "Roda Aro 19 Suzuka", sizeInch: 19, price: 6_200, isDefault: false },
            ],
        },
        seats: seats(6_400),
        technologies: {
            create: [
                { name: "VW Play Pro", description: "Central multimídia de 10,1\" com navegação embarcada.", price: 0 },
                { name: "Teto solar panorâmico", description: "Teto solar elétrico com cortina elétrica.", price: 7_900 },
                { name: "Pacote IQ.Drive", description: "Piloto automático adaptativo e frenagem autônoma de emergência.", price: 0 },
                { name: "Beats Audio", description: "Sistema de som Beats com 8 alto-falantes e subwoofer.", price: 4_500 },
                { name: "Bancos ventilados", description: "Ventilação e ajuste elétrico para os bancos dianteiros.", price: 5_100 },
            ],
        },
        technicalData: {
            create: {
                engineDisplacement: "1.4 TSI 16v",
                enginePower: "150 cv",
                engineTorque: "25,5 kgfm",
                acceleration0to100: "9,3 s",
                topSpeed: "193 km/h",
                fuelConsumptionCity: "9,1 km/l",
                fuelConsumptionHwy: "11,6 km/l",
                tankCapacity: "55 L",
                wheelbase: "2.680 mm",
                length: "4.462 mm",
                width: "1.841 mm",
                height: "1.626 mm",
                curbWeight: "1.475 kg",
                cargoVolume: "498 L",
                frontSuspension: "Independente McPherson",
                rearSuspension: "Eixo de torção",
                brakes: "Discos ventilados (diant.) e sólidos (tras.)",
            },
        },
    },
    {
        slug: "jetta",
        name: "Jetta GLI",
        tagline: "230 cv de esportividade alemã.",
        description: "O sedã esportivo da Volkswagen: motor 2.0 TSI, transmissão DSG de 7 marchas, diferencial VAQ e acabamento premium de série.",
        basePrice: 274_990,
        fuel: "GASOLINE",
        transmission: "AUTOMATIC",
        isElectric: false,
        isFeatured: true,
        year: 2026,
        imageUrl: "/assets/cars/jetta/jetta.webp",
        interiorImageUrl: "/assets/cars/jetta/config/internal.jpg",
        colors: {
            create: [
                { name: "Branco Cristal", hexCode: "#F2F2F2", price: 0, isDefault: true, imageUrl: "/assets/cars/jetta/config/white.jpg" },
                { name: "Preto Ninja", hexCode: "#111213", price: PAINT_METALLIC, isDefault: false, imageUrl: "/assets/cars/jetta/config/black.jpg" },
                { name: "Azul Glacial", hexCode: "#BFD3D0", price: PAINT_PREMIUM, isDefault: false, imageUrl: "/assets/cars/jetta/config/glacial.jpg" },
            ],
        },
        wheels: {
            create: [
                { name: "Roda Aro 18 Mallory", sizeInch: 18, price: 0, isDefault: true },
                { name: "Roda Aro 19 Estoril", sizeInch: 19, price: 5_400, isDefault: false },
            ],
        },
        seats: seats(0),
        technologies: {
            create: [
                { name: "VW Play Pro", description: "Central multimídia de 10,1\" com navegação embarcada.", price: 0 },
                { name: "Digital Cockpit Pro", description: "Painel digital de 10,25\" com layouts configuráveis.", price: 0 },
                { name: "Beats Audio", description: "Sistema de som Beats com 8 alto-falantes e subwoofer.", price: 0 },
                { name: "Teto solar panorâmico", description: "Teto solar elétrico com cortina elétrica.", price: 8_400 },
                { name: "Pacote IQ.Drive", description: "Piloto automático adaptativo e frenagem autônoma de emergência.", price: 0 },
            ],
        },
        technicalData: {
            create: {
                engineDisplacement: "2.0 TSI 16v",
                enginePower: "230 cv",
                engineTorque: "35,7 kgfm",
                acceleration0to100: "6,7 s",
                topSpeed: "240 km/h",
                fuelConsumptionCity: "8,3 km/l",
                fuelConsumptionHwy: "11,1 km/l",
                tankCapacity: "51 L",
                wheelbase: "2.686 mm",
                length: "4.702 mm",
                width: "1.799 mm",
                height: "1.459 mm",
                curbWeight: "1.472 kg",
                cargoVolume: "510 L",
                frontSuspension: "Independente McPherson",
                rearSuspension: "Multilink",
                brakes: "Discos ventilados nas quatro rodas",
            },
        },
    },
    {
        slug: "id4",
        name: "ID.4",
        tagline: "100% elétrico, zero emissão.",
        description: "O primeiro SUV elétrico global da Volkswagen. Até 532 km de autonomia, carregamento rápido em corrente contínua e tração traseira.",
        basePrice: 339_990,
        fuel: "ELECTRIC",
        transmission: "AUTOMATIC",
        isElectric: true,
        isFeatured: true,
        year: 2026,
        imageUrl: "/assets/cars/id4/id4.webp",
        colors: colors("/assets/cars/id4/id4.webp"),
        wheels: {
            create: [
                { name: "Roda Aro 19 Hamar", sizeInch: 19, price: 0, isDefault: true },
                { name: "Roda Aro 20 Drammen", sizeInch: 20, price: 6_800, isDefault: false },
            ],
        },
        seats: seats(0),
        technologies: {
            create: [
                { name: "Discover Pro", description: "Central multimídia de 12\" com navegação e assistente por voz.", price: 0 },
                { name: "ID.Light", description: "Faixa luminosa que comunica navegação, chamadas e carregamento.", price: 0 },
                { name: "Head-up Display AR", description: "Projeção de realidade aumentada sobre o para-brisa.", price: 9_200 },
                { name: "Travel Assist", description: "Condução semiautônoma de nível 2 em rodovias.", price: 0 },
                { name: "Bomba de calor", description: "Reduz o consumo de bateria no uso do ar-condicionado.", price: 7_300 },
            ],
        },
        technicalData: {
            create: {
                engineDisplacement: "Motor elétrico síncrono (APP 310)",
                enginePower: "204 cv",
                engineTorque: "31,6 kgfm",
                acceleration0to100: "8,5 s",
                topSpeed: "160 km/h",
                fuelConsumptionCity: "532 km de autonomia (WLTP)",
                fuelConsumptionHwy: "Carga 5%-80% em 36 min (DC 135 kW)",
                tankCapacity: "Bateria de 82 kWh",
                wheelbase: "2.766 mm",
                length: "4.584 mm",
                width: "1.852 mm",
                height: "1.640 mm",
                curbWeight: "2.124 kg",
                cargoVolume: "543 L",
                frontSuspension: "Independente McPherson",
                rearSuspension: "Multilink",
                brakes: "Discos ventilados (diant.) e tambor (tras.)",
            },
        },
    },
    {
        slug: "amarok",
        name: "Amarok",
        tagline: "A picape que encara qualquer terreno.",
        description: "Motor V6 turbodiesel, tração 4Motion permanente e capacidade de carga de uma tonelada. Robustez alemã para trabalho e lazer.",
        basePrice: 329_990,
        fuel: "DIESEL",
        transmission: "AUTOMATIC",
        isElectric: false,
        isFeatured: false,
        year: 2026,
        imageUrl: "/assets/cars/amarok/amarok.webp",
        colors: colors("/assets/cars/amarok/amarok.webp"),
        wheels: {
            create: [
                { name: "Roda Aro 18 Talca", sizeInch: 18, price: 0, isDefault: true },
                { name: "Roda Aro 20 Milford", sizeInch: 20, price: 7_100, isDefault: false },
            ],
        },
        seats: seats(6_900),
        technologies: {
            create: [
                { name: "VW Play Pro", description: "Central multimídia de 10,1\" com navegação embarcada.", price: 0 },
                { name: "Câmera 360º", description: "Visão periférica com quatro câmeras e linhas dinâmicas.", price: 4_800 },
                { name: "Capota marítima elétrica", description: "Abertura e fechamento elétricos da caçamba.", price: 9_600 },
                { name: "Pacote off-road", description: "Protetores de cárter, bloqueio de diferencial e modo trilha.", price: 8_200 },
            ],
        },
        technicalData: {
            create: {
                engineDisplacement: "3.0 V6 TDI",
                enginePower: "258 cv",
                engineTorque: "59,1 kgfm",
                acceleration0to100: "7,8 s",
                topSpeed: "205 km/h",
                fuelConsumptionCity: "8,4 km/l",
                fuelConsumptionHwy: "10,7 km/l",
                tankCapacity: "80 L",
                wheelbase: "3.097 mm",
                length: "5.350 mm",
                width: "1.954 mm",
                height: "1.884 mm",
                curbWeight: "2.253 kg",
                cargoVolume: "1.000 kg de carga útil",
                frontSuspension: "Independente duplo A",
                rearSuspension: "Eixo rígido com feixe de molas",
                brakes: "Discos ventilados nas quatro rodas",
            },
        },
    },
    {
        slug: "saveiro",
        name: "Saveiro",
        tagline: "A picape compacta mais vendida do Brasil.",
        description: "Caçamba de 715 litros, motor 1.6 MSI e o custo de manutenção que fez da Saveiro a parceira de quem trabalha todos os dias.",
        basePrice: 118_990,
        fuel: "FLEX",
        transmission: "MANUAL",
        isElectric: false,
        isFeatured: false,
        year: 2026,
        imageUrl: "/assets/cars/saveiro/saveiro.webp",
        colors: colors("/assets/cars/saveiro/saveiro.webp"),
        wheels: {
            create: [
                { name: "Roda Aro 14 Aço", sizeInch: 14, price: 0, isDefault: true },
                { name: "Roda Aro 15 Trend", sizeInch: 15, price: 1_900, isDefault: false },
                { name: "Roda Aro 16 Cross", sizeInch: 16, price: 3_200, isDefault: false },
            ],
        },
        seats: seats(3_100),
        technologies: {
            create: [
                { name: "VW Play", description: "Central multimídia de 10,1\" com espelhamento sem fio.", price: 2_400 },
                { name: "Sensor de estacionamento", description: "Sensores traseiros com alerta sonoro.", price: 1_300 },
                { name: "Protetor de caçamba", description: "Revestimento plástico para a caçamba.", price: 1_800 },
            ],
        },
        technicalData: {
            create: {
                engineDisplacement: "1.6 MSI 16v",
                enginePower: "120 cv (etanol)",
                engineTorque: "16,8 kgfm",
                acceleration0to100: "10,9 s",
                topSpeed: "172 km/h",
                fuelConsumptionCity: "8,1 km/l (etanol)",
                fuelConsumptionHwy: "9,6 km/l (etanol)",
                tankCapacity: "55 L",
                wheelbase: "2.957 mm",
                length: "4.905 mm",
                width: "1.733 mm",
                height: "1.573 mm",
                curbWeight: "1.180 kg",
                cargoVolume: "715 L de caçamba",
                frontSuspension: "Independente McPherson",
                rearSuspension: "Eixo rígido com feixe de molas",
                brakes: "Discos ventilados (diant.) e tambor (tras.)",
            },
        },
    },
]

const dealers = [
    { name: "Volkswagen Paulista", address: "Av. Paulista, 1842", city: "São Paulo", state: "SP", zip: "01310-200", phone: "+55 11 3000-1000", email: "paulista@vwwebsite.dev", lat: -23.5613, lng: -46.6565 },
    { name: "Volkswagen Morumbi", address: "Av. Giovanni Gronchi, 5930", city: "São Paulo", state: "SP", zip: "05724-003", phone: "+55 11 3000-1001", email: "morumbi@vwwebsite.dev", lat: -23.6216, lng: -46.7229 },
    { name: "Volkswagen Campinas", address: "Av. John Boyd Dunlop, 2400", city: "Campinas", state: "SP", zip: "13060-000", phone: "+55 19 3000-1002", email: "campinas@vwwebsite.dev", lat: -22.9319, lng: -47.1064 },
    { name: "Volkswagen Barra", address: "Av. das Américas, 7777", city: "Rio de Janeiro", state: "RJ", zip: "22793-081", phone: "+55 21 3000-1003", email: "barra@vwwebsite.dev", lat: -22.9998, lng: -43.3652 },
    { name: "Volkswagen Savassi", address: "Av. Getúlio Vargas, 1420", city: "Belo Horizonte", state: "MG", zip: "30112-021", phone: "+55 31 3000-1004", email: "savassi@vwwebsite.dev", lat: -19.9386, lng: -43.9333 },
    { name: "Volkswagen Batel", address: "Av. do Batel, 1680", city: "Curitiba", state: "PR", zip: "80420-090", phone: "+55 41 3000-1005", email: "batel@vwwebsite.dev", lat: -25.4413, lng: -49.2907 },
    { name: "Volkswagen Moinhos", address: "Rua Padre Chagas, 320", city: "Porto Alegre", state: "RS", zip: "90570-080", phone: "+55 51 3000-1006", email: "moinhos@vwwebsite.dev", lat: -30.0246, lng: -51.2048 },
    { name: "Volkswagen Boa Viagem", address: "Av. Conselheiro Aguiar, 2340", city: "Recife", state: "PE", zip: "51020-020", phone: "+55 81 3000-1007", email: "boaviagem@vwwebsite.dev", lat: -8.1206, lng: -34.8983 },
]

function daysFromNow(days: number): Date {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d
}

const offers: Prisma.OfferCreateInput[] = [
    {
        name: "Jetta",
        title: "Jetta GLI com entrada facilitada de R$ 20.000",
        subtitle: "Taxa de 0,99% a.m. no financiamento pelo Banco Volkswagen.",
        category: "sedan",
        model: "jetta",
        type: "novo",
        price: 274_990,
        discount: 20_000,
        imageUrl: "/assets/cars/jetta/offer.webp",
        badge: "Últimas unidades",
        validUntil: daysFromNow(45),
    },
    {
        name: "Nivus",
        title: "Nivus Highline com bônus de até R$ 12.000",
        subtitle: "Bônus válido para pessoa física na compra à vista.",
        category: "suv",
        model: "nivus",
        type: "novo",
        price: 134_890,
        discount: 12_000,
        imageUrl: "/assets/cars/nivus/offer.webp",
        badge: "Mais procurado",
        validUntil: daysFromNow(30),
    },
    {
        name: "Polo",
        title: "Polo TSI 2026 a partir de R$ 96.990",
        subtitle: "Primeira parcela para 90 dias.",
        category: "hatch",
        model: "polo",
        type: "novo",
        price: 96_990,
        imageUrl: "/assets/cars/polo/offer.webp",
        validUntil: daysFromNow(60),
    },
    {
        name: "Polo",
        title: "Polo Highline 2023 seminovo com 28.000 km",
        subtitle: "Garantia de fábrica até 2027 e revisões em dia.",
        category: "hatch",
        model: "polo",
        type: "seminovo",
        price: 78_900,
        discount: 5_100,
        imageUrl: "/assets/cars/polo/offer.webp",
        badge: "Único dono",
        validUntil: daysFromNow(21),
    },
    {
        name: "Nivus",
        title: "Nivus Comfortline 2023 seminovo com 41.000 km",
        subtitle: "Laudo cautelar aprovado e transferência inclusa.",
        category: "suv",
        model: "nivus",
        type: "seminovo",
        price: 104_900,
        discount: 6_000,
        imageUrl: "/assets/cars/nivus/offer.webp",
        validUntil: daysFromNow(21),
    },
    {
        name: "T-Cross",
        title: "T-Cross Sense 2024 seminovo com 19.500 km",
        subtitle: "Revisado nas concessionárias Volkswagen.",
        category: "suv",
        model: "t-cross",
        type: "seminovo",
        price: 122_900,
        imageUrl: "/assets/cars/t-cross/t-cross.webp",
        badge: "Baixa quilometragem",
        validUntil: daysFromNow(28),
    },
    {
        name: "Jetta",
        title: "Jetta Comfortline 2022 seminovo com 52.000 km",
        subtitle: "Financiamento em até 60 meses sem entrada.",
        category: "sedan",
        model: "jetta",
        type: "seminovo",
        price: 148_900,
        discount: 9_000,
        imageUrl: "/assets/cars/jetta/offer.webp",
        validUntil: daysFromNow(35),
    },
    {
        name: "Saveiro",
        title: "Saveiro Robust 2023 seminovo com 63.000 km",
        subtitle: "Caçamba protegida e pneus novos.",
        category: "picape",
        model: "saveiro",
        type: "seminovo",
        price: 92_900,
        imageUrl: "/assets/cars/saveiro/saveiro.webp",
        validUntil: daysFromNow(40),
    },
    {
        name: "Amarok",
        title: "Amarok V6 Highline 2024 seminovo com 24.000 km",
        subtitle: "4Motion permanente e capota marítima inclusa.",
        category: "picape",
        model: "amarok",
        type: "seminovo",
        price: 289_900,
        discount: 15_000,
        imageUrl: "/assets/cars/amarok/amarok.webp",
        badge: "Oportunidade",
        validUntil: daysFromNow(25),
    },
]

async function main() {
    console.log("Limpando dados existentes...")

    await prisma.lead.deleteMany()
    await prisma.savedConfiguration.deleteMany()
    await prisma.technicalData.deleteMany()
    await prisma.carTechnology.deleteMany()
    await prisma.carSeat.deleteMany()
    await prisma.carWheel.deleteMany()
    await prisma.carColor.deleteMany()
    await prisma.car.deleteMany()
    await prisma.offer.deleteMany()
    await prisma.dealer.deleteMany()
    await prisma.passwordReset.deleteMany()
    await prisma.session.deleteMany()
    await prisma.user.deleteMany()

    console.log("👤 Criando usuários...")

    const createdUsers = await Promise.all(
        users.map(async (u) =>
            prisma.user.create({
                data: {
                    name: u.name,
                    email: u.email,
                    passwordHash: await bcrypt.hash(u.password, SALT_ROUNDS),
                    role: u.role,
                    phone: u.phone,
                    emailVerified: new Date(),
                },
            })
        )
    )

    console.log("Criando modelos...")

    const createdCars = []
    for (const car of cars) {
        createdCars.push(await prisma.car.create({ data: car }))
    }

    console.log("Criando concessionárias...")

    const createdDealers = await Promise.all(
        dealers.map((d) => prisma.dealer.create({ data: d }))
    )

    console.log("Criando ofertas...")

    await Promise.all(offers.map((o) => prisma.offer.create({ data: o })))

    console.log("Criando configurações salvas...")

    const customer = createdUsers.find((u) => u.role === "USER")!

    for (const slug of ["nivus", "id4"]) {
        const car = await prisma.car.findUniqueOrThrow({
            where: { slug },
            include: {
                colors: true,
                wheels: true,
                seats: true,
                technologies: true,
            },
        })

        const color = car.colors[1] ?? car.colors[0]
        const wheel = car.wheels[car.wheels.length - 1]
        const seat = car.seats[1] ?? car.seats[0]
        const techs = car.technologies.slice(0, 2)

        const total =
            Number(car.basePrice) +
            Number(color.price) +
            Number(wheel.price) +
            Number(seat.price) +
            techs.reduce((sum, t) => sum + Number(t.price), 0)

        await prisma.savedConfiguration.create({
            data: {
                userId: customer.id,
                carId: car.id,
                code: `${slug.toUpperCase().replace("-", "")}0001`.slice(0, 8),
                colorId: color.id,
                wheelId: wheel.id,
                seatId: seat.id,
                techIds: techs.map((t) => t.id),
                totalPrice: total,
            },
        })
    }

    console.log("Criando leads...")

    const leadSeeds = [
        { name: "Marina Alves", email: "marina.alves@example.com", phone: "+55 71 98888-1111", message: "Gostaria de agendar um test drive.", status: "PENDING" as const, carSlug: "nivus", dealerIndex: 0 },
        { name: "Rodrigo Prado", email: "rodrigo.prado@example.com", phone: "+55 21 98888-2222", message: "Tenho interesse no financiamento em 48x.", status: "CONTACTED" as const, carSlug: "t-cross", dealerIndex: 3 },
        { name: "Juliana Castro", email: "juliana.castro@example.com", phone: "+55 31 98888-3333", message: "Qual o prazo de entrega do ID.4?", status: "PENDING" as const, carSlug: "id4", dealerIndex: 4 },
        { name: "Felipe Moura", email: "felipe.moura@example.com", phone: "+55 41 98888-4444", message: "Quero avaliar meu usado na troca.", status: "CONVERTED" as const, carSlug: "jetta", dealerIndex: 5 },
        { name: "Bianca Reis", email: "camila.reis@example.com", phone: "+55 51 98888-5555", message: "A Saveiro está disponível em estoque?", status: "LOST" as const, carSlug: "saveiro", dealerIndex: 6 },
        { name: "Guilherme Tavares", email: "bruno.tavares@example.com", phone: "+55 19 98888-6666", message: "Preciso de uma proposta para frota.", status: "PENDING" as const, carSlug: "amarok", dealerIndex: 2 },
    ]

    for (const lead of leadSeeds) {
        const car = createdCars.find((c) => c.slug === lead.carSlug)
        await prisma.lead.create({
            data: {
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                message: lead.message,
                status: lead.status,
                carId: car?.id ?? null,
                dealerId: createdDealers[lead.dealerIndex]?.id ?? null,
            },
        })
    }

    console.log("\n✅ Seed concluído.")
    console.log(`   ${createdUsers.length} usuários, ${createdCars.length} modelos, ${createdDealers.length} concessionárias, ${offers.length} ofertas, ${leadSeeds.length} leads.`)
    console.log("\n   Credenciais de acesso:")
    users.forEach((u) => console.log(`   ${u.role.padEnd(5)} → ${u.email} / ${u.password}`))
}

main()
    .catch((err) => {
        console.error("❌ Erro no seed:", err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })