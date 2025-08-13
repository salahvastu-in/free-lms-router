export function Button({ as:Comp='button', className='', children, ...props }){
  const C = Comp
  return <C className={`px-4 py-2 rounded bg-blue-600 text-white hover:opacity-90 disabled:opacity-50 ${className}`} {...props}>{children}</C>
}