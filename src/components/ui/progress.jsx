export function Progress({ value=0 }){
  return <div className="w-full bg-gray-200 h-2 rounded"><div className="h-2 rounded bg-blue-600" style={{width: Math.max(0,Math.min(100,value))+'%'}}></div></div>
}