import { readable } from "svelte/store";
import type Puzzle from "$backend_interfaces/Puzzle"
import type Loadable from "$lib/types/loadable";

const todaysPuzzle = readable<Loadable<Puzzle>>(
  { loading: true }, 
  // Runs when it gets its first subscriber
  (set) => {
    // id: string
    // centerLetter: string
    // outsideLetters: [string, string, string, string, string, string]
    // wordList: string[]
    // date: string

    // {
    //   loading: false,
    //   data: {
    //     id: 'abcdef',
    //     centerLetter: 'N',
    //     outsideLetters: ['M', 'A', 'D', 'O', 'L', 'I'],
    //     wordList: ['ADMIN', 'AMINO', 'AMMONIA', 'ANAL', 'ANNAL', 'ANIMA', 'ANIMAL', 'DAMN', 'DINO', 'DOMAIN', 'INLAID', 'INLAND', 'LAIN', 'LAND', 'LAMINA', 'LAMINAL', 'LIMINA', 'LIMINAL', 'LOAN', 'LOIN', 'MADMAN', 'MAILMAN', 'MAIN', 'MAMMALIAN', 'MANIA', 'MANDOLIN', 'MILLION', 'MINIMA', 'MINIMAL', 'MOAN', 'MONOMIAL', 'MOON', 'NAIL', 'NAAN', 'NOMAD'],
    //     date: '03/18/2024'
    //   }
    // }

    // set({
    //   loading: false,
    //   data: {
    //     id: 'abcdef',
    //     centerLetter: 'E',
    //     outsideLetters: ['A', 'S', 'T', 'H', 'R', 'I'],
    //     wordList: ['AETAT', 'AIRIER', 'AIRIEST', 'AREA', 'AREAS', 'ARISE', 'ARISES', 'ARRASTRE', 'ARREAR', 'ARREARS', 'ARREST', 'ARRESTS', 'ARRET', 'ARRISES', 'ARSE', 'ARSES', 'ARTER', 'ARTERIA', 'ARTERITIS', 'ARTISTE', 'ARTISTES', 'ASSE', 'ASSERT', 'ASSERTS', 'ASSES', 'ASSESS', 'ASSET', 'ASSETS', 'ASSISE', 'ASSISTER', 'ASTATE', 'ASTER', 'ASTERS', 'ASTRE', 'ATES', 'ATHEIST', 'ATHEISTS', 'ATRESIA', 'ATRESIAS', 'ATTE', 'ATTER', 'ATTEST', 'ATTESTS', 'ATTIRE', 'ATTIRER', 'ATTIRES', 'EARS', 'EARTHS', 'EASTS', 'EATH', 'EATS', 'ERAT', 'ERIA', 'ERRATA', 'ERRS', 'ERST', 'ERTH', 'ESTATS', 'ETATIST', 'HAIRE', 'HAIRIER', 'HARASSER', 'HARASSERS', 'HARASSES', 'HARES', 'HARRIER', 'HARRIERS', 'HARRIES', 'HARSHER', 'HARSHEST', 'HASHES', 'HASTATE', 'HASTE', 'HASTES', 'HATE', 'HATER', 'HATERS', 'HATES', 'HATTE', 'HATTER', 'HATTERS', 'HEAR', 'HEARS', 'HEART', 'HEARTH', 'HEARTHS', 'HEARTS', 'HEAT', 'HEATHS', 'HEATS', 'HEIR', 'HEIRS', 'HEIST', 'HEISTS', 'HERS', 'HERT', 'HEST', 'HETAIRA', 'HETAIRAI', 'HIES', 'HIRE', 'HIRER', 'HIRERS', 'HISSES', 'HITHER', 'HITTER', 'HITTERS', 'IRATE', 'IRES', 'IRISES', 'IRRITATE', 'IRRITATES', 'ISTER', 'ITER', 'ITERS', 'ITHER', 'RAISE', 'RAISER', 'RAISERS', 'RAISES', 'RARER', 'RARES', 'RAREST', 'RARITIES', 'RASE', 'RASES', 'RASHER', 'RASHERS', 'RASHES', 'RASHEST', 'RASTER', 'RASTERS', 'RATE', 'RATER', 'RATERS', 'RATES', 'RATHE', 'RATITES', 'RATTER', 'RATTIER', 'REAR', 'REARS', 'REATA', 'REHASH', 'REIT', 'RESH', 'RESIST', 'RESISTS', 'RESIT', 'REST', 'RESTART', 'RESTARTS', 'RESTS', 'RETIA', 'RETRAIT', 'RETS', 'RHEAS', 'RIER', 'RISER', 'RISERS', 'RISES', 'RITE', 'RITES', 'SAITHE', 'SARE', 'SASHES', 'SATE', 'SATES', 'SATIATE', 'SATIATES', 'SATIRE', 'SATIRES', 'SATIRISE', 'SATIRISES', 'SEAR', 'SEAT', 'SEATS', 'SEIS', 'SEIT', 'SERAI', 'SERAIS', 'SERS', 'SERTA', 'SESS', 'SETS', 'SETT', 'SETTS', 'SHARE', 'SHARER', 'SHARERS', 'SHARES', 'SHATTER', 'SHATTERS', 'SHEARS', 'SHEATH', 'SHEATHS', 'SHES', 'SHIES', 'SHIRES', 'SIER', 'SIERRAS', 'SIESTA', 'SIESTAS', 'SIRE', 'SIRES', 'SISE', 'SISSIES', 'SITE', 'SITES', 'SITHE', 'SITTERS', 'STARE', 'STARES', 'STARETS', 'STARTER', 'STARTERS', 'STASES', 'STASHES', 'STATER', 'STATERS', 'STER', 'STET', 'STIES', 'STIRRER', 'STIRRERS', 'STRAITER', 'STRAITEST', 'STRATE', 'STRE', 'STRESS', 'STRETTA', 'STRETTI', 'STRIAE', 'STRIATE', 'TAREA', 'TARES', 'TARRIES', 'TARSIER', 'TARSIERS', 'TARTARE', 'TARTE', 'TARTRATE', 'TARTRATES', 'TASSE', 'TASTE', 'TASTER', 'TASTERS', 'TASTES', 'TASTIER', 'TASTIEST', 'TATER', 'TATERS', 'TATTER', 'TATTERS', 'TATTIES', 'TEAR', 'TEARS', 'TEAS', 'TEAT', 'TEATS', 'TERAS', 'TERRAS', 'TERTII', 'TESTA', 'TESTIS', 'TESTS', 'TETH', 'TETRA', 'TETRAS', 'THAE', 'THEAH', 'THEIR', 'THEIRS', 'THEIST', 'THEISTS', 'THER', 'THESIS', 'THIRSTIER', 'THIRTIES', 'THIRTIETH', 'THITHER', 'THRASHERS', 'THRASHES', 'THREAT', 'THREATS', 'THRESH', 'TIER', 'TIERRAS', 'TIERS', 'TIES', 'TIRE', 'TIRER', 'TIRES', 'TITE', 'TITER', 'TITERS', 'TITHE', 'TITHER', 'TITHES', 'TITRATE', 'TITRATES', 'TITRE', 'TITRES', 'TITTER', 'TITTERS', 'TITTIES', 'TRAITRESS', 'TREAS', 'TREATS', 'TRES', 'TRESS', 'TRET', 'TRIERS', 'TRIES', 'TRISTATE', 'TRISTE', 'TRITE', 'TRITEST'],
    //     date: '03/18/2024'
    //   }
    // })

    set({
      loading: false,
      data: {
        id: 'abcdef',
        centerLetter: 'A',
        outsideLetters: ['S', 'T', 'R', 'F', 'I', 'H'],
        wordList: ['AFFT', 'AFRIT', 'AFRITS', 'AIRISH', 'AIRS', 'AIRT', 'AIRTH', 'AIRTHS', 'AIRTS', 'AITH', 'AITIS', 'AITS', 'ARFS', 'ARISH', 'ARIST', 'ARITH', 'ARRIS', 'ARRISH', 'ARSIS', 'ARTHRITIS', 'ARTIST', 'ARTISTS', 'ARTS', 'ASIS', 'ASSI', 'ASSIS', 'ASSISH', 'ASSIST', 'ASSISTS', 'ASSITH', 'ASST', 'ASTIR', 'ASTR', 'ATHIRST', 'ATTRIST', 'FAFF', 'FAIRISH', 'FAIRS', 'FAIT', 'FAITHS', 'FAITS', 'FART', 'FARTH', 'FARTS', 'FASH', 'FASS', 'FASTI', 'FASTISH', 'FASTS', 'FATH', 'FATS', 'FATTISH', 'FIAR', 'FIARS', 'FIAT', 'FIATS', 'FRAIST', 'FRASS', 'FRAT', 'FRATS', 'FRIAR', 'FRIARS', 'HAFFIT', 'HAFFITS', 'HAFIS', 'HAFT', 'HAFTS', 'HAHS', 'HAIR', 'HAIRIF', 'HAIRS', 'HAIRST', 'HAIT', 'HARISH', 'HARR', 'HARSH', 'HARSHISH', 'HARST', 'HASH', 'HASHISH', 'HASHT', 'HAST', 'HASTIF', 'HASTISH', 'HATH', 'HATHI', 'HATS', 'HATT', 'IASIS', 'ITAI', 'ITTRIA', 'RAFFISH', 'RAFFS', 'RAFT', 'RAFTS', 'RAIF', 'RARISH', 'RASH', 'RATFISH', 'RATH', 'RATS', 'RATTI', 'RATTISH', 'RIFART', 'RIFFRAFF', 'RIFFRAFFS', 'SAFT', 'SAHH', 'SAITH', 'SARIF', 'SARIS', 'SASH', 'SATI', 'SATIRIST', 'SATIRISTS', 'SATIS', 'SHAFII', 'SHAFT', 'SHAFTS', 'SHAHI', 'SHAHS', 'SHAI', 'SHARIF', 'SHARIFS', 'SHASTRI', 'SHAT', 'SHIAI', 'SHIRRA', 'SHITA', 'SHITTAH', 'SHITTAHS', 'SHRAF', 'SIRIASIS', 'SIRRA', 'SIRRAH', 'SIRRAHS', 'SIRRAS', 'SISTRA', 'SITAR', 'SITARIST', 'SITARISTS', 'SITARS', 'SITFAST', 'STAFF', 'STAFFISH', 'STAIR', 'STAIRS', 'STAITH', 'STARFISH', 'START', 'STARTISH', 'STARTS', 'STASH', 'STASIS', 'STAT', 'STATIST', 'STATISTS', 'STATS', 'STIRRA', 'STRA', 'STRAITS', 'STRASS', 'STRATH', 'STRATHS', 'STRATI', 'STRIA', 'TAHR', 'TAHRS', 'TAISH', 'TARI', 'TARIFF', 'TARIFFIST', 'TARIFFS', 'TARISH', 'TARRI', 'TARRISH', 'TARS', 'TARSI', 'TARSITIS', 'TART', 'TARTISH', 'TARTS', 'TASH', 'TASHRIF', 'TATH', 'TATS', 'THARF', 'THAT', 'THATS', 'THIASI', 'THRASH', 'THRAST', 'TIAR', 'TISAR', 'TITAR', 'TRAH', 'TRAIST', 'TRAIT', 'TRAITS', 'TRASH', 'TRASS', 'TRIARII', 'TRIFA', 'TSAR', 'TSARIST', 'TSARISTS', 'TSARS', 'TSIA'],
        date: '03/18/2024'
      }
    })
  }
)

export default todaysPuzzle