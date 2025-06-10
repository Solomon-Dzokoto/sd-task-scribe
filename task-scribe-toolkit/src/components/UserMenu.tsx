import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { Icons } from "./ui/icons";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";

export function UserMenu() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 px-4  bg-primary rounded-full">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full ">
                        <span className="text-sm font-medium text-primary-foreground">
                            {user.name.charAt(0)}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <div className="p-2">
                    <ThemeToggle />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onClick={handleLogout}
                >
                    <Icons.logout className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
