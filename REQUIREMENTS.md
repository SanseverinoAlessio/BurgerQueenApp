# Burger Queen - Requisiti checkout, account e immagini categorie

## 1. Scopo

Questo documento definisce i requisiti funzionali e tecnici per completare:

- il checkout dell'app mobile Expo;
- la modifica del profilo e della password;
- il caricamento delle immagini delle categorie;
- le modifiche backend Laravel necessarie a supportare questi flussi;
- la protezione delle API OTP da utilizzi abusivi.

Il documento si applica ai seguenti progetti:

- frontend: `BurgerQueenNewApp/burger-queen`;
- backend: `burgerQueen/BurgerQueenBE`.

## 2. Direttive e vincoli inderogabili

### 2.1 Regole di progetto

- Seguire sempre tutti gli `AGENTS.md` applicabili al file sul quale si interviene.
- Prima di scrivere codice Expo, consultare la documentazione ufficiale esatta di Expo 57: <https://docs.expo.dev/versions/v57.0.0/>.
- Ogni schermata React Native deve utilizzare il container pattern.
- La logica applicativa e le richieste devono essere collocate nei servizi.
- Le richieste frontend devono utilizzare il client Axios esistente.
- Nel backend Laravel devono essere rispettati architettura e pattern esistenti.
- I controller Laravel devono rimanere sottili.
- Usare Form Request per la validazione, Policy/Gate per l'autorizzazione, Resource per la serializzazione e service per la logica applicativa, in coerenza con il codice esistente.
- Prima di implementare una funzione, cercare e riutilizzare implementazioni equivalenti già presenti.
- Evitare refactoring estranei, duplicazioni e nuove dipendenze non strettamente necessarie.

### 2.2 Ambiente e sicurezza operativa

- Non eseguire alcuna operazione sul database di produzione.
- Non collegarsi al database di produzione, neppure in sola lettura.
- Non utilizzare servizi o API di produzione.
- Lavorare sempre e soltanto tramite `127.0.0.1`.
- Prima di eseguire comandi backend, verificare che la configurazione attiva punti a `127.0.0.1` e a risorse locali.
- Non eseguire deploy.
- Non eseguire comandi distruttivi.
- Non modificare migrazioni storiche.
- Eventuali variazioni dello schema richiedono una nuova migrazione retrocompatibile, ma nessuna migrazione deve essere eseguita su produzione.
- Non alterare i contratti pubblici delle API esistenti, salvo autorizzazione esplicita.
- Non introdurre servizi esterni, provider a pagamento o nuove infrastrutture senza autorizzazione.

### 2.3 Verifiche previste in questa fase

Per esplicita richiesta del committente, in questa fase:

- non creare nuovi test automatici;
- non eseguire test automatici esistenti;
- rinviare la realizzazione della suite automatica a un'attività successiva;
- sono consentiti lint, typecheck, analisi statica, build e verifiche manuali non distruttive, purché operino esclusivamente in locale.

## 3. Checkout

### 3.1 Obiettivo

Completare il flusso di checkout dalla gestione del carrello fino alla creazione dell'ordine, includendo totale autorevole, orari reali, modalità di consegna, verifica del numero telefonico e svuotamento sicuro del carrello.

### 3.2 Prodotti, quantità e totale

#### Requisiti funzionali

- Verificare l'intero flusso di aggiunta, modifica quantità e rimozione dei prodotti.
- Ogni voce del carrello deve corrispondere al prodotto, alle varianti e alle opzioni selezionate.
- L'aggiunta ripetuta dello stesso prodotto deve rispettare il comportamento già previsto dal dominio esistente.
- Il totale visualizzato deve aggiornarsi dopo ogni variazione del carrello.
- Il calcolo deve includere correttamente:
  - prezzo unitario;
  - quantità;
  - varianti e opzioni;
  - maggiorazioni o sconti già supportati;
  - eventuali costi di consegna già previsti dal backend.
- Il frontend deve rappresentare correttamente il totale, ma il backend deve essere l'autorità finale.
- Il backend deve ricalcolare prezzi e totale usando dati affidabili lato server.
- Prezzi o totali inviati dal client non devono essere considerati autorevoli.
- Il totale salvato nell'ordine deve coincidere con quello calcolato dal backend.
- Il carrello deve essere letto e modificato esclusivamente dall'utente autenticato che ne è proprietario.

#### Criteri di accettazione

- Aggiunta, modifica quantità e rimozione producono contenuto e totale corretti.
- Totale frontend e totale backend coincidono.
- La manipolazione del payload client non permette di alterare il totale server.
- Un utente non può vedere o modificare il carrello di un altro utente.

### 3.3 Orari disponibili

#### Requisiti funzionali

- Rimuovere tutti gli orari placeholder dal checkout.
- Individuare e riutilizzare le API backend esistenti per gli orari.
- Caricare gli orari tramite un servizio frontend e il client Axios esistente.
- Mostrare esclusivamente gli orari restituiti dal backend locale.
- Conservare formato e regole temporali previsti dalle API.
- Gestire gli stati di caricamento, lista vuota ed errore.
- Permettere di riprovare dopo un errore, quando appropriato.
- Se gli orari dipendono da data o modalità di consegna, aggiornarli quando cambia la selezione pertinente.
- Impedire la conferma se manca un orario obbligatorio o se l'orario non è più disponibile.
- Non inviare né salvare valori placeholder.

#### Criteri di accettazione

- Nessun orario fittizio è utilizzato dall'interfaccia o dal payload.
- Gli orari mostrati coincidono con quelli restituiti dal backend.
- Un orario assente o non valido non può essere confermato.
- Gli stati vuoto ed errore sono comprensibili e gestibili.

### 3.4 Modalità di consegna

#### Requisiti funzionali

- Aggiungere al checkout un campo che consenta di scegliere una sola modalità tra `take away` e `delivery`.
- Verificare prima se backend, enum, DTO, modello ordine e API supportano già questa proprietà.
- Riutilizzare nomi dei campi e valori già previsti dal backend.
- Non introdurre un formato parallelo o incompatibile.
- Includere la modalità selezionata nel payload dell'ordine secondo il contratto esistente.
- Rendere la modalità selezionata chiaramente riconoscibile nell'interfaccia.
- Impedire la conferma in assenza di una modalità valida.
- Aggiornare orari e costi se il comportamento backend esistente li rende dipendenti dalla modalità.
- Non inventare costi, zone di consegna o campi indirizzo non già definiti nel dominio.

#### Criteri di accettazione

- È possibile selezionare alternativamente `take away` o `delivery`.
- Il valore selezionato viene inviato e salvato nel formato previsto dal backend.
- Il checkout non può essere confermato senza una modalità valida.
- Eventuali dipendenze già previste tra modalità, orari e costi sono rispettate.

### 3.5 Conferma dell'ordine

#### Validazioni preliminari

Prima dell'invio verificare almeno:

- presenza di almeno un prodotto;
- quantità valide;
- modalità di consegna selezionata;
- orario selezionato, quando obbligatorio;
- campi ulteriori richiesti dal contratto API esistente;
- stato di verifica del numero telefonico.

#### Comportamento della conferma

- Durante l'invio mostrare lo stato di caricamento e disabilitare il comando.
- Evitare richieste concorrenti e conferme duplicate.
- In caso di errore, conservare carrello e selezioni e mostrare un messaggio utile.
- In caso di successo, mostrare il risultato previsto dal flusso esistente.
- Dopo il successo, impedire una seconda creazione accidentale dello stesso ordine e aggiornare lo stato locale del carrello.

### 3.6 Verifica telefonica prima dell'ordine

#### Condizione

Il controllo deve avvenire quando l'utente tenta di confermare l'ordine.

Mostrare il popup esclusivamente se `users.phone_number_verified_at` è nullo o assente. Se contiene una data valida, il popup non deve apparire.

#### Comportamento

- Se il numero non è verificato, interrompere la conferma prima della creazione dell'ordine.
- Mostrare un popup che informi l'utente della necessità di verificare il numero.
- Il popup deve offrire almeno un'azione di chiusura e l'azione `Procedi`.
- Premendo `Procedi`, navigare alla schermata di inserimento OTP.
- Riutilizzare le API OTP già implementate.
- Non creare un secondo flusso OTP se quello esistente è riutilizzabile.
- Conservare il carrello e le selezioni del checkout durante la procedura.
- Dopo la verifica, aggiornare i dati dell'utente e consentire di riprendere il checkout.
- L'ordine non deve essere creato finché il numero non risulta verificato.
- Il backend deve impedire l'aggiramento del controllo tramite chiamata diretta, se la verifica telefonica è un requisito del flusso di creazione ordine.

#### Criteri di accettazione

- Il popup appare solo agli utenti senza `phone_number_verified_at`.
- Un utente verificato procede senza popup.
- `Procedi` apre la schermata OTP corretta.
- Carrello e selezioni non vengono persi durante la verifica.
- Nessun ordine viene creato prima della verifica richiesta.

### 3.7 Limitazione dell'invio degli OTP

#### Obiettivo

Proteggere l'API di invio OTP da richieste abusive, invii concorrenti e consumo eccessivo di risorse.

#### Regole

- Verificare e riutilizzare un eventuale sistema centralizzato di rate limiting già presente nel backend.
- In assenza di regole esistenti, adottare valori configurabili con i seguenti default:
  - almeno 60 secondi tra due invii consecutivi;
  - massimo 5 invii in 15 minuti;
  - massimo 10 invii in 24 ore.
- Applicare il conteggio almeno alla combinazione di utente autenticato e numero telefonico normalizzato.
- Applicare un limite per indirizzo IP come protezione secondaria.
- Non permettere di aggirare i limiti cambiando soltanto sessione o payload.
- Inserire soglie e finestre temporali nella configurazione backend, evitando magic number nella logica applicativa.

#### Comportamento backend

- Applicare il limite sul server; il timer frontend è solamente un supporto UX.
- La richiesta OTP deve riguardare l'utente autenticato.
- Normalizzare il numero prima di determinare la chiave del limite.
- Incrementare il conteggio quando l'invio viene effettivamente richiesto al servizio OTP.
- Al superamento del limite, restituire HTTP `429 Too Many Requests`.
- Quando possibile, includere l'header `Retry-After`.
- Non esporre informazioni che permettano di scoprire se un numero appartiene a un altro account.
- Rendere il controllo resistente a richieste concorrenti.
- Gestire un OTP ancora valido secondo il comportamento backend esistente, evitando più codici contemporaneamente validi se non supportati.
- Poiché Redis è già previsto dallo stack backend, preferire i meccanismi Laravel esistenti e la configurazione locale, senza introdurre nuove infrastrutture.

#### Comportamento frontend

- Dopo un invio riuscito, disabilitare il pulsante di reinvio per 60 secondi.
- Mostrare il tempo rimanente prima di un nuovo invio.
- Evitare richieste concorrenti causate da tocchi ripetuti.
- In caso di `429`, mostrare un messaggio comprensibile e rispettare `Retry-After`, se presente.
- Non mostrare uno stato di successo quando il backend rifiuta l'invio.

#### Criteri di accettazione

- Il cooldown e le soglie vengono applicati anche chiamando direttamente l'API.
- Richieste concorrenti non permettono di superare il limite.
- Il superamento della soglia produce una risposta `429` coerente.
- Il frontend mostra correttamente attesa ed errore.
- Le soglie sono configurabili.
- Il limite di un utente non blocca impropriamente utenti differenti.

Il limite ai tentativi di verifica con OTP errato non rientra in questo intervento, salvo che sia già previsto dal flusso esistente.

### 3.8 Salvataggio dell'ordine e svuotamento del carrello

#### Requisiti funzionali e di integrità

- Salvare l'ordine rigorosamente secondo lo standard già previsto dalle API.
- Non rinominare campi e non modificare payload, response o struttura dell'ordine.
- Non creare endpoint alternativi se quello esistente è adeguato.
- Ricavare l'identità dell'utente dall'autenticazione server.
- Salvare prodotti, quantità, opzioni, modalità, orario e totale secondo il modello esistente.
- Dopo la creazione riuscita, cancellare esclusivamente i record del carrello appartenenti all'utente autenticato che ha effettuato l'ordine.
- Non modificare i carrelli di altri utenti.
- Non svuotare il carrello se il salvataggio dell'ordine fallisce.
- Gestire creazione ordine e svuotamento del carrello in una transazione atomica, se compatibile con l'architettura esistente.
- Evitare ordini parziali, perdita del carrello e duplicazioni dovute a invii ripetuti.

#### Criteri di accettazione

- L'ordine viene salvato nel formato esistente.
- Il totale salvato è quello calcolato dal backend.
- Dopo il successo, è vuoto soltanto il carrello dell'utente interessato.
- Un errore non causa la cancellazione del carrello.
- La conferma involontariamente ripetuta non genera duplicazioni.

## 4. Account

### 4.1 Modifica dei dati personali

#### Requisiti frontend

- Mostrare nella pagina profilo i dati correnti dell'utente.
- Consentire la modifica dei soli campi supportati dal modello e dalle API.
- Validare i campi prima dell'invio.
- Inviare le modifiche tramite un servizio account e il client Axios esistente.
- Gestire caricamento, salvataggio, successo ed errore.
- Dopo il successo, aggiornare lo stato locale usando la risposta autorevole del backend.

#### Requisiti backend e di sicurezza

- Proteggere l'endpoint con autenticazione.
- Ricavare l'utente dal token o dalla sessione autenticata.
- Permettere a ogni utente di modificare esclusivamente il proprio record.
- Non fidarsi di `user_id` o altri identificativi modificabili inviati dal client.
- Evitare mass assignment di campi sensibili o amministrativi.
- Accettare soltanto campi esplicitamente autorizzati e validati.
- Utilizzare Form Request, Policy/Gate e service coerenti con l'architettura esistente.
- Se cambia il numero telefonico, rispettare la regola di dominio esistente relativa all'eventuale azzeramento di `phone_number_verified_at`.

#### Criteri di accettazione

- L'utente può aggiornare i propri dati validi.
- I dati locali vengono sincronizzati dopo il salvataggio.
- Alterare URL, payload o identificativi non consente di modificare un altro account.
- Campi non autorizzati vengono ignorati o rifiutati.
- Gli errori di validazione vengono rappresentati correttamente.

### 4.2 Modifica della password

#### Interfaccia

- Quando viene selezionata l'icona o la sezione password, renderla attiva con il pallino giallo previsto dal design.
- Disattivare visivamente le altre sezioni.
- Mostrare i campi:
  - password attuale;
  - nuova password;
  - ripeti nuova password.
- Utilizzare input sicuri per tutti i campi password.

#### Comportamento

- Verificare lato frontend che nuova password e ripetizione coincidano.
- Rispettare le regole password definite dal backend.
- Verificare lato backend la password attuale.
- Applicare la modifica esclusivamente all'utente autenticato.
- Non registrare le password nei log e non conservarle nello stato oltre il necessario.
- Dopo il successo, svuotare i campi e mostrare una conferma.
- Una password attuale errata non deve produrre alcuna modifica.
- Riutilizzare l'endpoint esistente; se assente, implementare il comportamento secondo l'architettura corrente senza alterare gli standard condivisi.

#### Criteri di accettazione

- La sezione password attiva mostra il pallino giallo.
- I tre campi vengono mostrati nello stato corretto.
- Password nuove non coincidenti non vengono inviate.
- Una password attuale errata impedisce l'aggiornamento.
- Un utente non può modificare la password di un altro utente.

## 5. Immagini delle categorie

### 5.1 Obiettivo

Consentire a un utente autorizzato di caricare e associare un'immagine a una categoria.

### 5.2 Requisiti

- Individuare il flusso esistente di creazione e modifica delle categorie.
- Verificare se modello, API o storage supportano già un'immagine.
- Riutilizzare il sistema di upload già presente, se disponibile.
- Aggiungere il campo immagine alla gestione delle categorie.
- Consentire selezione, caricamento, anteprima, salvataggio e sostituzione dell'immagine.
- Considerare l'immagine opzionale, salvo una diversa regola già presente.
- Mantenere funzionanti le categorie esistenti senza immagine.
- Validare lato backend tipo MIME, estensione e dimensione del file secondo le convenzioni esistenti.
- Autorizzare l'operazione soltanto agli utenti che possono già gestire le categorie.
- Usare la rappresentazione di file e URL già adottata dalle API.
- Non introdurre provider esterni o storage a pagamento.
- Non caricare file verso servizi di produzione.
- In assenza di storage esistente, adottare una soluzione locale coerente con Laravel e raggiungibile tramite `127.0.0.1`.
- Non cancellare in modo distruttivo un'immagine sostituita senza avere verificato che non sia condivisa o ancora referenziata.

### 5.3 Criteri di accettazione

- Un utente autorizzato può caricare un'immagine per una categoria.
- L'immagine rimane associata dopo il salvataggio ed è visualizzabile.
- L'immagine può essere sostituita.
- File non validi vengono rifiutati con un errore comprensibile.
- Le categorie senza immagine continuano a funzionare.
- Un utente non autorizzato non può caricare o sostituire immagini.
- Nessun file viene inviato a infrastrutture di produzione.

## 6. Autonomia operativa autorizzata

Quando il committente autorizzerà esplicitamente l'implementazione, Codex potrà, senza ulteriori conferme ordinarie:

- esplorare frontend e backend;
- individuare endpoint, modelli, servizi e flussi esistenti;
- creare, modificare, spostare e rinominare file compresi nello scope;
- scegliere dettagli tecnici coerenti con l'architettura;
- correggere problemi direttamente collegati ai requisiti;
- consultare la documentazione ufficiale;
- eseguire lint, typecheck, analisi statica, build e verifiche manuali locali;
- continuare fino al soddisfacimento dei criteri di accettazione.

È comunque obbligatorio fermarsi prima di:

- accedere o operare su dati o servizi di produzione;
- usare host diversi da `127.0.0.1`;
- eseguire deploy, operazioni distruttive o acquisti;
- cambiare i contratti pubblici delle API;
- introdurre servizi esterni o costi;
- ampliare materialmente lo scope;
- assumere una decisione di prodotto non deducibile dai requisiti o dal comportamento esistente.

Le autorizzazioni qui riportate non sostituiscono gli eventuali permessi tecnici obbligatori richiesti dall'ambiente di esecuzione.

## 7. Definizione di completamento

L'intervento sarà considerato completato quando:

- tutti i criteri di accettazione descritti sono soddisfatti;
- frontend e backend rispettano i rispettivi `AGENTS.md`;
- i contratti API esistenti risultano invariati, salvo autorizzazioni esplicite;
- nessuna operazione ha coinvolto produzione o host diversi da `127.0.0.1`;
- lint, typecheck, analisi statica e build pertinenti risultano verificati, nei limiti dell'ambiente locale;
- il diff finale è stato riesaminato per individuare regressioni e modifiche fuori scope;
- vengono riepilogati file modificati, verifiche eseguite, assunzioni e limitazioni residue;
- i test automatici restano esplicitamente rinviati alla fase successiva richiesta dal committente.
