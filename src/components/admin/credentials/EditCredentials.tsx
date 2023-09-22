import { EditCredentialDocument, EditCredentialMutation, EditCredentialMutationVariables, Credential, Roles, Type, Team } from '@/gql/graphql';
import React, { useState } from 'react'
import { OperationResult, useMutation } from 'urql';

interface Props {
  name: string;
  id: number;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  data: Credential[]
  setData: React.Dispatch<React.SetStateAction<Credential[]>>
  teams:Team[]
  team?: string;
  roles : Roles
}

const EditCredential = (props: Props) => {
   const [name, setName] = useState<string>(props.name);
    const [password , setPassword ] = useState<string >("password")
    const [roles , setRoles ] = useState<Roles>(props.roles)
    const [team , setTeam ] = useState<string>(props.team as string)
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [state, UpdateCredentialExecute] = useMutation(EditCredentialDocument);


  const HandleSubmit = async (data: any) => {
    setIsLoading(true);
    console.log(data);

    const updatedData: OperationResult<EditCredentialMutation, EditCredentialMutationVariables> = await UpdateCredentialExecute({
      id: props.id,
      name,
      categories : "",
      password,
       roles,
      team
    });

    if (updatedData.data?.updateCredential) {
      alert("Credential Updated");
      const updatedDates = props.data.map((value, index) => {
        if (value.id == updatedData.data?.updateCredential?.id) {
          return value = updatedData.data?.updateCredential as Credential
        } else {
          return value
        }
      })
      console.log(updatedDates);

      props.setData(updatedDates as Credential[]);
    } else if (updatedData.error?.message) {
      alert(updatedData.error?.message.split(']')[1]);
    }
    else {
      alert("Credential Not Updated");
    }
    setIsLoading(false);
    props.setIsEdit(false);
  }


  return (
    <div>
      <button className="bg-green-500" onClick={() => props.setIsEdit(false)}>
        Back
      </button>
      <h1>Edit Credential</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          HandleSubmit({
            name,  
          })
        }}
      >
        <p>Name</p>
        <input
          type="text"
          defaultValue={name}
          onChange={(e) => setName(e.target.value) }
        />
        <p>Password</p>
        <input
          type="text"
          defaultValue={password}
          onChange={(e) => setPassword(e.target.value) }
          />
        <p>Roles</p>
        <select name="" id=""
          value={roles}
          onChange={(e) => setRoles(e.target.value as Roles)}
        >
          <option value={Roles.Admin}>Admin</option>
          <option value={Roles.Controller}>Controller</option>
          <option value={Roles.Media}>Media</option>
          <option value={Roles.TeamManager}>Team Manager</option>
        </select>
        { 
          roles == Roles.TeamManager &&
         <>
          <p>Team</p>
          <select name="" id=""
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          >
            {
              props.teams.map((item) => {
                return (
                  <option value={item.name as string}>{item.name}</option>
                )
              })
            }
          </select>
          </>
        }
        <button
          className="bg-fuchsia-600"
          type="submit"
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default EditCredential