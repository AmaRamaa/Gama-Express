import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      company: {
        about: 'About Our Company',
        description: 'Gama Express is a leading supplier of high-quality automotive parts and accessories, partnering with top global brands to deliver reliable solutions for every vehicle. Our commitment to excellence, innovation, and customer satisfaction drives us to provide products that meet the highest industry standards. Whether you are a professional mechanic or a car enthusiast, we offer a comprehensive range of parts to keep your vehicle running at its best.',
        brands: 'Our Brands',
      },
      home: {
        heroText: 'Welcome to Gama Express – your one-stop destination for premium auto parts!',
        heroSubText: 'Browse through our vast inventory, discover unbeatable deals, and enjoy fast service backed by a passionate team ready to help you.',
        popularBrands: 'Popular Brands',
        latestProducts: 'Latest Products',
      },
      brands: {
        TYC: {
          description: 'TYC specializes in innovative automotive lighting and cooling solutions, blending advanced technology with reliability for modern vehicles.'
        },
        DEPO: {
          description: 'DEPO is renowned for its precision-engineered automotive lighting products, offering safety and style for drivers worldwide.'
        },
        Nissens: {
          description: 'Nissens delivers advanced thermal solutions, including radiators and climate systems, engineered for efficiency and durability.'
        },
        Valeo: {
          description: 'Valeo is a global leader in smart automotive systems, providing innovative solutions for comfort, safety, and energy efficiency.'
        },
        'Mars Tech': {
          description: 'Mars Tech offers dependable automotive components, focusing on quality and performance to keep vehicles running smoothly.'
        },
        API: {
          description: 'API delivers high-performance automotive parts, combining innovation and reliability for a superior driving experience.'
        },
        'Magneti Marelli': {
          description: 'Magneti Marelli is a leading global supplier of automotive components and systems, known for innovation in lighting, electronics, and powertrain solutions.'
        },
        OEM: {
          description: 'Original Equipment Manufacturer (OEM): Trusted for producing high-quality, factory-standard automotive parts that ensure optimal vehicle performance.'
        }
      },
      manufacturers: {
        title: 'Manufacturers',
      },
      models: {
        searchResults: 'Search Results',
        noPartsForSearch: 'No parts found for this search.',
        brands: 'Brands',
        modelsFor: 'Models for {{manufacturer}}',
        productsFor: 'Products for {{manufacturer}} {{selectedModel}}',
        noPartsForModel: 'No parts found for this model.',
      },
      productDetails: {
        notFound: 'Part not found.',
        contactSales: 'Contact Sales',
        callSales: 'Call Sales',
        chooseApp: 'Choose your preferred app to contact us:',
        viewAllDetails: 'View All Details',
        hideDetails: 'Hide Details',
        relatedProducts: 'Related Products',
        filterRelated: 'Filter related products...',
        noRelated: 'No related products found.',
      },
      searchResults: {
        title: 'Search Results',
        noParts: 'No parts found for this search.',
      },
      news: {
        title: 'Latest News',
        loading: 'Loading news...',
        noNews: 'No news available.',
        postVisual: 'Post visual',
        noContent: 'No content',
      },
      legal: {
        title: 'Legal Disclaimers',
        intro: 'The information provided by Gama Express on this website is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.',
        noAdvice: 'No Professional Advice',
        noAdviceText: 'The site cannot and does not contain legal, financial, or other professional advice. Any information provided is for general informational and educational purposes only and is not a substitute for professional advice.',
        externalLinks: 'External Links Disclaimer',
        externalLinksText: 'The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties. We do not investigate, monitor, or check such external links for accuracy, adequacy, validity, reliability, availability, or completeness.',
        limitation: 'Limitation of Liability',
        limitationText: 'Under no circumstance shall Gama Express have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site.',
        contact: 'Contact Us',
        contactText: 'If you have any questions regarding these disclaimers, please contact us at',
      },
      contacts: {
        title: 'Contact Us',
        whatsapp: 'WhatsApp',
        viber: 'Viber',
        email: 'Email',
      },
      auth: {
        login: 'Login',
        username: 'Username:',
        password: 'Password:',
        invalid: 'Invalid username or password',
      },
      header: {
        home: 'Home',
        company: 'The Company',
        catalog: 'Catalog',
        contacts: 'Contacts',
        news: 'News',
        legal: 'Legal Disclaimer',
        customerService: 'Customer service',
        searchPlaceholder: 'Product name or item number...'
      },
      footer: {
        quickLinks: 'QUICK LINKS',
        cookiePolicy: 'Cookie Policy',
        privacy: 'Privacy',
        legal: 'Legal disclaimer',
        codiceEtico: 'Codice Etico',
        informativaGenerale: 'Informativa generale',
        eliminaCookie: 'Elimina i cookie salvati',
        seats: 'SEATS',
        seat1: 'Seat 1: Front Left',
        seat2: 'Seat 2: Front Right',
        seat3: 'Seat 3: Middle Left',
        seat4: 'Seat 4: Middle Right',
        seat5: 'Seat 5: Back Left',
        seat6: 'Seat 6: Back Right',
        company: 'GAMA EXPRESS SH.P.K',
        address: 'Prrëoi i Njelmët , 10000 Pristinë, Kosovë',
        copyright: '© 2025 Gama Express. All rights reserved.'
      },
      sidebar: {
        title: 'Sidebar',
        dashboard: 'Dashboard',
        profile: 'Profile',
        settings: 'Settings',
        home: 'Home',
        manufacture: 'Manufacture',
        manufactureList: 'List',
        manufactureCreate: 'Create',
        models: 'Models',
        modelsList: 'List',
        modelsCreate: 'Create',
        parts: 'Parts',
        partsList: 'List',
        partsCreate: 'Create',
        profiles: 'Profiles',
        profilesList: 'List',
        profilesCreate: 'Create',
        logout: 'Logout'
      },
    }
  },
  sq: {
    translation: {
      company: {
        about: 'Rreth Kompanisë Tonë',
        description: 'Gama Express është një furnizues kryesor i pjesëve dhe aksesorëve të automobilave me cilësi të lartë, duke bashkëpunuar me markat më të mira globale për të ofruar zgjidhje të besueshme për çdo automjet. Përkushtimi ynë ndaj përsosmërisë, inovacionit dhe kënaqësisë së klientit na shtyn të ofrojmë produkte që plotësojnë standardet më të larta të industrisë. Qoftë ju jeni një mekanik profesionist apo një entuziast i makinave, ne ofrojmë një gamë të gjerë pjesësh për të mbajtur automjetin tuaj në gjendjen më të mirë.',
        brands: 'Markat Tona',
      },
      home: {
        heroText: 'Mirë se vini në Gama Express – destinacioni juaj për pjesë premium të automjeteve!',
        heroSubText: 'Shfletoni inventarin tonë të gjerë, zbuloni oferta të pakrahasueshme dhe përfitoni nga shërbimi i shpejtë me një ekip të përkushtuar që është gjithmonë gati t’ju ndihmojë.',
        popularBrands: 'Markat Popullore',
        latestProducts: 'Produktet e Fundit',
      },
      brands: {
        TYC: {
          description: 'TYC specializohet në zgjidhje inovative të ndriçimit dhe ftohjes së automobilave, duke kombinuar teknologjinë e avancuar me besueshmërinë për automjetet moderne.'
        },
        DEPO: {
          description: 'DEPO është i njohur për produktet e ndriçimit të automobilave të inxhinieruara me precizion, duke ofruar siguri dhe stil për shoferët në mbarë botën.'
        },
        Nissens: {
          description: 'Nissens ofron zgjidhje të avancuara termike, përfshirë radiatorë dhe sisteme klime, të dizajnuara për efikasitet dhe qëndrueshmëri.'
        },
        Valeo: {
          description: 'Valeo është një lider global në sistemet e zgjuara të automobilave, duke ofruar zgjidhje inovative për komoditet, siguri dhe efikasitet energjetik.'
        },
        'Mars Tech': {
          description: 'Mars Tech ofron komponentë të besueshëm të automobilave, duke u fokusuar në cilësi dhe performancë për të mbajtur automjetet në funksion të mirë.'
        },
        API: {
          description: 'API ofron pjesë automobilash me performancë të lartë, duke kombinuar inovacionin dhe besueshmërinë për një përvojë superiore të drejtimit.'
        },
        'Magneti Marelli': {
          description: 'Magneti Marelli është një furnizues global kryesor i komponentëve dhe sistemeve të automobilave, i njohur për inovacion në ndriçim, elektronikë dhe zgjidhje të motorit.'
        },
        OEM: {
          description: 'Prodhuesi Origjinal i Pajisjeve (OEM): I besueshëm për prodhimin e pjesëve të automobilave me cilësi të lartë, standarde fabrike që sigurojnë performancë optimale të automjetit.'
        }
      },
      manufacturers: {
        title: 'Prodhuesit',
      },
      models: {
        searchResults: 'Rezultatet e Kërkimit',
        noPartsForSearch: 'Nuk u gjetën pjesë për këtë kërkim.',
        brands: 'Markat',
        modelsFor: 'Modelet për {{manufacturer}}',
        productsFor: 'Produktet për {{manufacturer}} {{selectedModel}}',
        noPartsForModel: 'Nuk u gjetën pjesë për këtë model.',
      },
      productDetails: {
        notFound: 'Pjesa nuk u gjet.',
        contactSales: 'Kontakto Shitjet',
        callSales: 'Thirr Shitjet',
        chooseApp: 'Zgjidh aplikacionin e preferuar për të na kontaktuar:',
        viewAllDetails: 'Shiko të gjitha detajet',
        hideDetails: 'Fshih detajet',
        relatedProducts: 'Produkte të ngjashme',
        filterRelated: 'Filtro produktet e ngjashme...',
        noRelated: 'Nuk u gjetën produkte të ngjashme.',
      },
      searchResults: {
        title: 'Rezultatet e Kërkimit',
        noParts: 'Nuk u gjetën pjesë për këtë kërkim.',
      },
      news: {
        title: 'Lajmet e Fundit',
        loading: 'Duke ngarkuar lajmet...',
        noNews: 'Nuk ka lajme të disponueshme.',
        postVisual: 'Pamje e postimit',
        noContent: 'Pa përmbajtje',
      },
      legal: {
        title: 'Mohimet Ligjore',
        intro: 'Informacioni i dhënë nga Gama Express në këtë faqe interneti është vetëm për qëllime të përgjithshme informuese. I gjithë informacioni në faqe jepet me mirëbesim, megjithatë ne nuk bëjmë asnjë përfaqësim ose garanci të asnjë lloji, të shprehur ose të nënkuptuar, në lidhje me saktësinë, mjaftueshmërinë, vlefshmërinë, besueshmërinë, disponueshmërinë ose plotësinë e ndonjë informacioni në faqe.',
        noAdvice: 'Pa Këshilla Profesionale',
        noAdviceText: 'Faqja nuk mund dhe nuk përmban këshilla ligjore, financiare ose profesionale të tjera. Çdo informacion i dhënë është vetëm për qëllime të përgjithshme informuese dhe edukative dhe nuk është zëvendësim për këshilla profesionale.',
        externalLinks: 'Mohimi i Lidhjeve të Jashtme',
        externalLinksText: 'Faqja mund të përmbajë (ose mund të dërgoheni përmes faqes) lidhje me faqe të tjera ose përmbajtje që i përkasin ose vijnë nga palë të treta. Ne nuk hetojmë, monitorojmë ose kontrollojmë këto lidhje të jashtme për saktësi, mjaftueshmërie, vlefshmëri, besueshmërie, disponueshmërie ose plotësi.',
        limitation: 'Kufizimi i Përgjegjësisë',
        limitationText: 'Në asnjë rrethanë Gama Express nuk do të ketë asnjë përgjegjësi ndaj jush për ndonjë humbje ose dëmtim të çfarëdo lloji të shkaktuar si rezultat i përdorimit të faqes ose mbështetjes në ndonjë informacion të dhënë në faqe.',
        contact: 'Na Kontaktoni',
        contactText: 'Nëse keni ndonjë pyetje në lidhje me këto mohime, ju lutemi na kontaktoni në',
      },
      contacts: {
        title: 'Na Kontaktoni',
        whatsapp: 'WhatsApp',
        viber: 'Viber',
        email: 'Email',
      },
      auth: {
        login: 'Kyçu',
        username: 'Përdoruesi:',
        password: 'Fjalëkalimi:',
        invalid: 'Përdorues ose fjalëkalim i pavlefshëm',
      },
      header: {
        home: 'Ballina',
        company: 'Kompania',
        catalog: 'Katalogu',
        contacts: 'Kontakt',
        news: 'Lajme',
        legal: 'Mohimi Ligjor',
        customerService: 'Shërbimi ndaj klientit',
        searchPlaceholder: 'Emri i produktit ose numri i artikullit...'
      },
      footer: {
        quickLinks: 'LIDHJE TË SHPEJTA',
        cookiePolicy: 'Politika e Cookie-ve',
        privacy: 'Privatësia',
        legal: 'Mohimi ligjor',
        codiceEtico: 'Kodi Etik',
        informativaGenerale: 'Informata të përgjithshme',
        eliminaCookie: 'Fshi cookie-t e ruajtura',
        seats: 'VENDET',
        seat1: 'Vendi 1: Para Majtas',
        seat2: 'Vendi 2: Para Djathtas',
        seat3: 'Vendi 3: Mes Majtas',
        seat4: 'Vendi 4: Mes Djathtas',
        seat5: 'Vendi 5: Mbrapa Majtas',
        seat6: 'Vendi 6: Mbrapa Djathtas',
        company: 'GAMA EXPRESS SH.P.K',
        address: 'Prrëoi i Njelmët , 10000 Pristinë, Kosovë',
        copyright: '© 2025 Gama Express. Të gjitha të drejtat e rezervuara.'
      },
      sidebar: {
        title: 'Anësorja',
        dashboard: 'Paneli',
        profile: 'Profili',
        settings: 'Cilësimet',
        home: 'Ballina',
        manufacture: 'Prodhuesit',
        manufactureList: 'Lista',
        manufactureCreate: 'Krijo',
        models: 'Modelet',
        modelsList: 'Lista',
        modelsCreate: 'Krijo',
        parts: 'Pjesët',
        partsList: 'Lista',
        partsCreate: 'Krijo',
        profiles: 'Profilet',
        profilesList: 'Lista',
        profilesCreate: 'Krijo',
        logout: 'Dil'
      },
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
