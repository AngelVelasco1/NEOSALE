import React from 'react';

export const RegisterForm = () => {
    return(
    <div className="max-w-lg max-sm:max-w-lg mx-auto p-6 mt-6">
      <div className="text-center mb-12 sm:mb-16">
    
        <h4 className="text-slate-900 text-center text-3xl font-semibold">Regístrate</h4>
      </div>

      <form>
        <div className="grid sm:grid gap-8">
          <div>
            <label className="text-slate-800 text-sm font-medium mb-2 block">Nombre</label>
            <input name="name" type="text" className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Escribe tu nombre" />
            </div>
            <div>
            <label className="text-slate-800 text-sm font-medium mb-2 block">Email</label>
            <input name="lname" type="text" className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Escribe tu correo" />
            </div>
            <div className="flex flex-col">
            <label className="text-slate-800 text-sm font-medium mb-2 block">Documento</label>
            <div className="flex">
            <select className="flex inline" name="Type" id=""><option value="C.C">C. C</option><option value="Cedula Extranjería">C. E</option></select>
            <input name="email" type="text" className="flex inline  bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Escribe tu documento" />
            </div>
            </div>
            <div>
            <label className="text-slate-800 text-sm font-medium mb-2 block">Teléfono</label>
            <input name="email" type="text" className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Escribe tu número de telefono" />
            </div>
            <div>
            <label className="text-slate-800 text-sm font-medium mb-2 block">Contraseña</label>
            <input name="password" type="password" className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Escribe Contraseña" />
            </div>
            <div>
            <label className="text-slate-800 text-sm font-medium mb-2 block">Confirmar contraseña</label>
            <input name="cpassword" type="password" className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Confirma contraseña" />
          </div>
        </div>

        <div className="mt-12">
          <button type="button" className="mx-auto block py-3 px-6 text-sm font-medium tracking-wider rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer">
            Regístrarse
          </button>
        </div>
      </form>
    </div>
    )
}