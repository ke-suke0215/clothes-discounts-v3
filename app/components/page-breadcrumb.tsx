import { Link } from '@remix-run/react';
import { Home } from 'lucide-react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

type PageBreadcrumbProps = {
	currentPage: string;
	items?: Array<{
		label: string;
		to: string;
	}>;
};

export function PageBreadcrumb({
	currentPage,
	items = [],
}: PageBreadcrumbProps) {
	return (
		<Breadcrumb className="mb-6">
			<BreadcrumbList>
				<BreadcrumbItem>
					<Link to="/" className="flex items-center gap-1">
						<Home className="h-4 w-4" />
						<span>TOP</span>
					</Link>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				{items.map((item, index) => (
					<>
						<BreadcrumbItem key={item.to}>
							<Link to={item.to}>{item.label}</Link>
						</BreadcrumbItem>
						<BreadcrumbSeparator key={`sep-${index}`} />
					</>
				))}
				<BreadcrumbItem>
					<BreadcrumbPage>{currentPage}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
